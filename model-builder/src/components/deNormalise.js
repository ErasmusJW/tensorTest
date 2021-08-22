const EventEmitter = require('events');
import fs from "fs"
import es from 'event-stream'
import fsPromise from "fs/promises"
const fsDetailsMethods = [ 'isDirectory', 'isFile'];
import * as tf from '@tensorflow/tfjs-node-gpu'

//restricting to discrete strings
async function readFolderContents(path)
{
  let content =  await fsPromise.readdir( path,{withFileTypes :true})
  content = content.map(d => {
    let cur = { name: d.name }
    for (let method of fsDetailsMethods) cur[method] = d[method]()
    return cur
  })
  return content
}

async function ensureFolder(path) {

    try{
        let doesExists = (await fsPromise.stat(path)).isDirectory()

       if(!doesExists)
           await fsPromise.mkdir(path)


   }catch(e)
   {
       await fsPromise.mkdir(path)
   }
}


function filterInt(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
      return Number(value)
    } else {
      return NaN
    }
  }

  class numberDenonarmaliser{
      constructor(parserDetails)
      {
          this.parserDetails = parserDetails
          this.parserSpan = parserDetails.normalise.max - parserDetails.normalise.min
          this.isOutput = false;
      }
      denomaliseVale(val,inputChain){
        let inputs =  [...inputChain,val]
        return [true,val * (this.parserSpan) + this.parserDetails.normalise.min, inputs];
      }  
  }


  class numberOutputDenonarmaliser{
    constructor(parserDetails)
    {
        this.parserDetails = parserDetails
        this.parserSpan = parserDetails.normalise.max - parserDetails.normalise.min
        this.isOutput = true;
    }
    denomaliseVale(val,inputChain){
      return [true,val * (this.parserSpan) + this.parserDetails.normalise.min, inputChain];
    }  
}

  class stringDiscreteNormaliser{
    constructor(heading,value)
    {
        this.heading = heading
        this.value = value
        this.isOutput = false;
    }
    denomaliseVale(val,inputChain){
        val = parseInt(val)
        let inputs =  [...inputChain,val]
        let returnVal = val ? this.value : null
        return[val,returnVal,inputs]
    }
    
    
    
    
}



class denormalise extends EventEmitter {
    path;
    readStreams = [];
    lineNr = 0;
    headings = [];
    data = {};
    meta = {};
    constructor(path,parser,model ) {

        super();
        this.path = path;
        this.parser = parser;
        this.model = model;

    }

    async  denormaliseData() {
        debugger
        await ensureFolder(`${this.path}/predictions`)
        let dataContent =  (await readFolderContents(`${this.path}/data`)).filter((elem)=>elem.isFile)

        
        for(let elem of dataContent)
        {

            let headings ;
            let denomarlisers = [];
            let readStream = fs.createReadStream(`${this.path}/data/${elem.name}`)
            let writeStream = fs.createWriteStream(`${this.path}/predictions/${elem.name}`,{flags : 'w'});
            let lineNr = 0

            readStream.pipe(es.split())
            .pipe(es.mapSync( (line)=>{

                    if(lineNr === 0)
                    {
                        headings = line.split(',')
                        let denormalHeadings = [];
                        for(const heading of headings)
                        {
                            let headingHandeld = this.isNumberInput(heading,denomarlisers)
                            if(headingHandeld)
                            {
                                denormalHeadings.push(heading)
                                continue
                            }
                            headingHandeld = this.isDiscreteInput(heading,denomarlisers)
                            if(headingHandeld)
                            {
                                const valueName = denomarlisers[denomarlisers.length-1].heading
                                if(!denormalHeadings.includes(valueName))
                                    denormalHeadings.push(valueName) 
                                continue
                            }
                            headingHandeld = this.isNumberOutput(heading,denomarlisers)
                            if(headingHandeld)
                            {
                                denormalHeadings.push(`${heading}_orig`)
                                denormalHeadings.push(`${heading}_predict`)
                                continue;
                            }
                            debugger;
                            throw new Error("denormaliser not implemented yet")
                        }
                        writeStream.write(denormalHeadings.join(','))

                    }
                    if(lineNr > 0)
                    {

                        const lineData = line.split(',');
                        let inputArray = [];
                        let denormalisedArry = []
                        
                        for(let headingIndex in headings){
                            let denmorVal = denomarlisers[headingIndex].denomaliseVale(lineData[headingIndex],inputArray)
                            inputArray = denmorVal[2]
                            if(denmorVal[0]){

                                denormalisedArry.push(denmorVal[1])
                            } else{
                                let cunt = "fuck"
                            }
                        }
                        
                        const tensor = tf.tensor(inputArray).reshape([-1, inputArray.length])
                        const prediction = this.model.predict(tensor).dataSync();
                        debugger;
                        const outPutDenomilasers = denomarlisers.filter(demon=>demon.isOutput)
                        for(let demon in outPutDenomilasers){
                            debugger
                            const predictValue = prediction[demon]
                            const val = outPutDenomilasers[demon].denomaliseVale(predictValue)
                            denormalisedArry.push(val[1])
                        }

                        writeStream.write("\n")
                        writeStream.write(denormalisedArry.join(','))

                    }
                    if(lineNr % 10 === 0){
                        this.emit("lineUpdate",this.lineNr)
                    }
                    lineNr += 1;



            }))
        }




    }
    isNumberInput(heading,denomarlisers){
        if(this.parser.inputs[heading]){
            denomarlisers.push(new numberDenonarmaliser(this.parser.inputs[heading]))
            return true

        }
        return false;  
    }
    isDiscreteInput(heading,denomarlisers){
        for(let input in this.parser.inputs)
        {
            const theInput = this.parser.inputs[input]
            if(!theInput.stats.values)
                continue
            if(theInput.stats.values[heading])
            {
                denomarlisers.push(new stringDiscreteNormaliser(input,heading))
                return true;
            }
        }
        return false
    }
    isNumberOutput(heading,denomarlisers){
        if(this.parser.outputs[heading]){
            denomarlisers.push(new numberOutputDenonarmaliser(this.parser.outputs[heading]))
            return true

        }
        return false;  
    }
}
export default denormalise