const EventEmitter = require('events');
import fs from "fs"
import es from 'event-stream'

function filterInt(value) {
    if (/^[-+]?(\d+|Infinity)$/.test(value)) {
      return Number(value)
    } else {
      return NaN
    }
  }

class readFile extends EventEmitter {
    filepath;
    readStream;
    lineNr = 0;
    headings = [];
    data = {};
    meta = {};
    constructor(filepath,dateField = null , dateFiledParser = null) {

        super();
        this.filepath = filepath;

    }

    async  readData() {

        this.readStream = fs.createReadStream(this.filepath)
        .pipe(es.split())
        .pipe(es.mapSync( (line)=>{

            // pause the readstream
            if(this.lineNr === 0)
            {
                this.headings = line.split(',')
                for(const heading of this.headings)
                {
                    this.data[heading] = []
                }
                console.log("headings",this.headings)
                console.log("data",this.data)

            }
            if(this.lineNr === 1)
            {

                const lineData = line.split(',');
                for(let headingIndex in this.headings)
                {

                    let isNumber =  !Number.isNaN(filterInt(lineData[headingIndex]));
                    let stats = {}
                    if(isNumber)
                    {
                        stats.min = parseInt(lineData[headingIndex]);
                        stats.max = parseInt(lineData[headingIndex]);

                    }else{
                        stats.values = {
                            [lineData[headingIndex]] : 1
                        }
                    }

                    this.meta[this.headings[headingIndex]] = {
                       isNumber:  isNumber,
                       value: lineData[headingIndex],
                       stats
                    }
                }

            }
            if(this.lineNr > 0)
            {

                const lineData = line.split(',');

                for(let headingIndex in this.headings)
                {

                    let meta = this.meta[this.headings[headingIndex]];
                    let value = meta.isNumber ? parseInt(lineData[headingIndex]) : lineData[headingIndex] ;
                    this.data[this.headings[headingIndex]].push(value)
                    if(meta.isNumber && value && !Number.isNaN(value)){
                        meta.stats.min = Math.min(meta.stats.min,value),
                        meta.stats.max = Math.max(meta.stats.max,value)
                    }else if(!meta.isNumber){
                        if(meta.stats.values[value])
                            meta.stats.values[value] = meta.stats.values[value] +1;
                        else
                            meta.stats.values[value] = 1;

                    }
                }

            }
            if(this.lineNr % 10 === 0){
                this.emit("lineUpdate",this.lineNr)
            }
            this.lineNr += 1;



        })
        .on('error', (err)=>{
            console.log('Error while reading file.', err);
            this.emit("error",this.lineNr)
        })
        .on('end', ()=>{
            this.emit("done",this.lineNr)
        }));



    }
}
export default readFile