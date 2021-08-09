const EventEmitter = require('events');
import fs from "fs/promises"
import fsNormal from "fs"
import es from 'event-stream'



const parserFolder = "internal"
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
        let UnormalisedData = nextValue
        let normalisedValue = (nextValue - this.parseRules.normalise.min) / this.normaleRange;
        ++this.i;
        return [[true,[UnormalisedData]],[normalisedValue]]
    }
    deNormaliseFunc(value){
        let temp = value*this.normaleRange
        let temp2 = temp +  this.parseRules.normalise.min
        return [true,(value*this.normaleRange) +  this.parseRules.normalise.min]

    }

}
class StringNormaliser{
    constructor(parseRules,data){
        this.parseRules = parseRules;
        this.i = 0;
        this.data = data;
        this.validValues = Object.keys(this.parseRules.stats.values)
        this.normaliseFunc = (this.parseRules.normalise.stringType === 'discrete') ? this.#normaliseDiscrete : this.#normaliseNormalise
        this.deNormaliseFunc = (this.parseRules.normalise.stringType === 'discrete') ? this.#denormaliseDiscrete : this.#denormaliseNomalsie
    }
    getHeader(){
        if(this.parseRules.normalise.stringType === 'discrete')
            return this.validValues
        return [this.parseRules.name]
    }

    #normaliseNormalise(value) {
        return [this.validValues.indexOf(value)/this.validValues.length]

    }
    #denormaliseNomalsie(value){
        let index = Math.round(value * this.validValues.length)
        if(index>this.validValues.length || index < 0)
        {
            return [false]

        }

        return [true,this.validValues[index]]
    }

    #denormaliseDiscrete(value){
        let index = value[0].indexOf(1)
        if(index<0 || index > this.validValues.length)
        {
            debugger;
            return [false]

        }
        return [true,this.validValues[index]]
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
        let UnormalisedData = nextValue
        let normalisedValue = this.normaliseFunc(nextValue)

        ++this.i;
        return [[true,[UnormalisedData]],normalisedValue]

    }


}

// class OutputNormaliser{
//     constructor(parseRules,data){
//         this.parseRules = parseRules;
//         this.i = 0;
//         this.data = data;

//     }
//     getHeader(){
//         return [this.parseRules.name]
//     }
//     getNextValue(){
//         if(this.i > this.data.length)
//          return [false];
//         let nextValue = this.data[this.i]
//         ++this.i
//         return [[true,[nextValue]],[nextValue]]

//     }
//     deNormaliseFunc(value){
//         return [true,value]

//     }



// }


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
        await ensureFolder(`${this.path}${parserFolder}/${this.name}`)
        let counter = 0;
        for(let item in this.parserObject.inputs)
        {
            this.parserObject.inputs[item].index = counter;
            counter++;
        }
        for(let item in this.parserObject.outputs)
        {
            this.parserObject.outputs[item].index = counter;
            counter++;
        }
        await fs.writeFile(`${this.path}${parserFolder}/${this.name}.json`, JSON.stringify(this.parserObject,null,2), 'utf8');
    }
    async normaliseData(){
        await ensureFolder(`${this.path}${parserFolder}/${this.name}/data`)
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
            if(parseObject.isNumber)
            {
                parsers.push(new NumberNormaliser(parseObject,this.data[item]))
            }else{
                parsers.push(new StringNormaliser(parseObject,this.data[item]))
            }
        }
        let writeStream = fsNormal.createWriteStream(`${this.path}${parserFolder}/${this.name}/data/${this.name}.csv`,{flags : 'w'});
        //let UnNormalisedTestStream = fsNormal.createWriteStream(`${this.path}${normaliseDataFolder}/unNormal.csv`,{flags : 'w'});
        let headers = [];
        for(let parser of parsers)
        {
            headers.push(...parser.getHeader())
        }
        writeStream.write(headers.join(','))
        for(let i = 0 ;  i < numberElements ; i++ )
        {
            let valueRow = []
            let originalValRow = []
            // let reconstructedRow = [];
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
                originalValRow.push(...value[0][1])
                // reconstructedRow.push(parser.deNormaliseFunc(value[1])[1])

            }
            if(!rowValid){
                ++invalidCount;
                continue
            }
            validCount++;
            writeStream.write("\n")
            writeStream.write(valueRow.join(','))

            // UnNormalisedTestStream.write("\n")
            // UnNormalisedTestStream.write(originalValRow.join(','))
            // UnNormalisedTestStream.write("\n")
            // UnNormalisedTestStream.write(reconstructedRow.join(','))

            if(i%10===0)
            {
                this.emit("parseUpdate",[validCount,invalidCount])
            }

        }
        this.emit("parseDone",[validCount,invalidCount])
    }


}
export default parseData