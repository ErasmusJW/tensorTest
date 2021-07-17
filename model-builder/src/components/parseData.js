const EventEmitter = require('events');
import fs from "fs/promises"
import fsNormal from "fs"
import es from 'event-stream'



const parserFolder = "parsers"
const normaliseDataFolder = 'normalisedData'

class NumberNormaliser{
    constructor(parseRules,data){
        this.parseRules = parseRules;
        this.i = 0;
        this.data = data;
        this.normaleRange = this.parseRules.normalise.max - this.parseRules.normalise.min
        
    }
    getHeader(){
        return [this.parseRules.name];
    }
    getNextValue(){
        if(this.i > this.data.length)
         return [false];
        let nextValue = this.data[this.i]
        let valid = (nextValue > this.parseRules.normalise.min) && (nextValue < this.parseRules.normalise.max)
        if(!valid)
        {
            ++this.i;
            return [false];
        }
        let normalisedValue = (nextValue - this.parseRules.normalise.min) / this.normaleRange;
        ++this.i;
        return [true,[normalisedValue]]
    }

}
class StringNormaliser{
    constructor(parseRules,data){
        this.parseRules = parseRules;
        this.i = 0;
        this.data = data;
        this.validValues = Object.keys(this.parseRules.stats.values)
        this.normaliseFunc = (this.parseRules.normalise.stringType === 'discrete') ? this.#normaliseDiscrete : this.#normaliseNormalise
    }
    getHeader(){
        if(this.parseRules.normalise.stringType === 'discrete')
            return this.validValues
        return [this.parseRules.name]
    }
    #normaliseNormalise(value) {
        return [this.validValues.indexOf(value)/this.validValues.length]
        
    }
    #normaliseDiscrete(value) {

        let returnArray =  new Array(this.validValues.length).fill(0);
        returnArray[this.validValues.indexOf(value)] = 1;
        return [returnArray]
         
     }
    getNextValue(){
        if(this.i > this.data.length)
         return [false];

        //abstract this out instead of check on each value 
        let nextValue = this.data[this.i]
        let valid = this.validValues.indexOf(nextValue) > -1;
        if(!valid)
        {
            ++this.i;
            return [false];
        }
        let normalisedValue = this.normaliseFunc(nextValue)
        ++this.i;
        return [true,normalisedValue]

    }
       

}

class OutputNormaliser{
    constructor(parseRules,data){
        this.parseRules = parseRules;
        this.i = 0;
        this.data = data;
        
    }
    getHeader(){
        return [this.parseRules.name] 
    }
    getNextValue(){
        if(this.i > this.data.length)
         return [false];
        let nextValue = this.data[this.i]
        return [true,[nextValue]]

    }
    


}


async function ensureFolder(path) {

    try{
        let doesExists = (await fs.stat(path)).isDirectory()

       if(!doesExists)
           await fs.mkdir(path)


   }catch(e)
   {
       await fs.mkdir(path)
   }
}

class parseData extends EventEmitter {
    data;
    meta;
    inputs;
    outputs;
    path;
    name;
    filename; //name of file containing data
    parserObject = {};
    constructor( {data, meta, inputs, outputs, path, name, filename}) {
        super();
        this.data = data;
        this.meta = meta;
        this.inputs  = inputs;
        this.outputs = outputs;
        this.path = path
        this.name = name;
        this.filename = filename;
        this.parserObject = {
            inputs : this.inputs,
            outputs : this.outputs,
            meta : this.meta,
            name : this.name

        }

        


    }
    setData(data){
        this.data = data;
    }
    async saveParser(){
        await ensureFolder(`${this.path}${parserFolder}`)
        await fs.writeFile(`${this.path}${parserFolder}/${this.name}.json`, JSON.stringify(this.parserObject,null,2), 'utf8');
    }
    async normaliseData(){
        let validCount = 0;
        let invalidCount = 0;
        let numberElements = 0;
        await ensureFolder(`${this.path}${normaliseDataFolder}`)
        let parsers = [];
        for(let item in this.inputs)
        {
            let parseObject = this.inputs[item]
            numberElements = this.data[item].length
            if(parseObject.isNumber)
            {
                parsers.push(new NumberNormaliser(parseObject,this.data[item]))
            }else{
                parsers.push(new StringNormaliser(parseObject,this.data[item]))
            }         
        }
        for(let item in this.outputs)
        {
            let parseObject = this.outputs[item]
            parsers.push(new OutputNormaliser(parseObject,this.data[item]))
        }
        let writeStream = fsNormal.createWriteStream(`${this.path}${normaliseDataFolder}/test.csv`,{flags : 'w'});
        let headers = [];
        for(let parser of parsers)
        {
            headers.push(...parser.getHeader())
        }
        writeStream.write(headers.join(','))
        for(let i = 0 ;  i < numberElements ; i++ )
        {
            let valueRow = []
            let rowValid = true;
            for(let parser of parsers)
            {
                let value = parser.getNextValue();
                if(!value[0] || !rowValid)
                {
                    rowValid = false;
                    continue  
                }
                valueRow.push(...value[1])

                //headers.push(...parser.getHeader())
            }
            if(!rowValid){
                ++invalidCount;
                continue
            }
            validCount++;
            writeStream.write("\n\r")
            writeStream.write(valueRow.join(','))


        }

    }


}
export default parseData