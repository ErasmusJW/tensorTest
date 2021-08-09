
<template>
<div>
  USE MODEL WORKS
  <p>parserId {{parserId}}</p>
  <p>modelId {{modelId}}</p>
  <p>workingPath {{workingPath}}</p>
  <p>modelPath {{this.modelPath}} </p>

  <button class="btn btn-primary" @click="trainAllData()"> Train with all data in data folder </button>
</div>

</template>

<script>
/* eslint-disable */
const {dialog} = require('electron').remote;

import { mapGetters, mapState } from 'vuex';
import fs from "fs/promises"
import configInput from './configInput.vue';

import * as tf from '@tensorflow/tfjs-node'



let model  = null;
const fsDetailsMethods = [ 'isDirectory', 'isFile'];
const trainingData = [];

async function readFolderContents(path)
{
  let content =  await fs.readdir( path,{withFileTypes :true})
  content = content.map(d => {
    let cur = { name: d.name }
    for (let method of fsDetailsMethods) cur[method] = d[method]()
    return cur
  })
  return content
}

export default {
  name: 'use-model',
  props: {

  },
  created: async function () {

    this.parserId = this.$route.params.parserId;
    this.modelId = this.$route.params.modelId;
    let parserName = this.parserFiles[this.parserId].name
    this.parserName = parserName.substring(0,parserName.indexOf(".json"))
    this.modelPath = `${this.workingPath}internal/${this.parserName}/models/${this.modelId}`

    let modelRaw = await fs.readFile(`${this.modelPath}/config.json`, 'utf8')
    this.modelConfig =  JSON.parse(modelRaw);

    let parserRaw = await fs.readFile(`${this.workingPath}internal/${parserName}`, 'utf8')
    this.parserConfig =  JSON.parse(parserRaw);

    this.dataPath = `${this.workingPath}internal/${parserName}/data`

    model = await tf.loadLayersModel(`file:///${this.modelPath}/model.json`);
    model.compile({loss: this.modelConfig.loss, optimizer: this.modelConfig.optimizer,  metrics: this.modelConfig.metrics});
    model.summary();




  },
  data: function(){
    return {
      parserId : '',
      modelId : '',
      modelPath :'',
      modelConfig : {},
      dataPath : '',
      parserName : "",
      parserConfig : {},
      columnConfigs : {},

    }

  },
  methods:{

    makeModel : async function(path){

      const tfModel = tf.sequential();
      tfModel.add(tf.layers.dense({
        inputShape: [this.model.inputLayer.inputShape],
        units: parseInt(this.model.inputLayer.units),
        activation : this.model.inputLayer.activation,
        }))
      for(let layer of this.model.hidenLayers){

        tfModel.add(tf.layers.dense({
          units: parseInt(layer.units),
          activation : layer.activation,
        }))
      }
      tfModel.add(tf.layers.dense({
        units: parseInt(this.model.outputLayer.units)
        }))
      tfModel.summary();
      await tfModel.save(`file:///${path}`);
    },
    saveModel : async function(){

    },
    trainAllData : async function() {

      for(const val in this.parserConfig.inputs)
      {

        if(this.parserConfig.inputs[val].normalise.stringType === "discrete")
        {
          for(const discreteVal in this.parserConfig.inputs[val].stats.values)
          {
            this.columnConfigs[discreteVal] = {
              isLabel:false
            }
          }
        }else{
          this.columnConfigs[val] = {
            isLabel:false
          }
        }
      }
      for(const val in this.parserConfig.outputs)
      {
        if(this.parserConfig.outputs[val].normalise.stringType === 'discrete')
        {
          for(const discreteVal in this.parserConfig.outputs[val].stats.values)
          {
            this.columnConfigs[discreteVal] = {
              isLabel:true
            }
          }
        }else{
          this.columnConfigs[val] = {
            isLabel:true
          }
        }
      }
      console.log(this.columnConfigs)


      let dataContent =  (await readFolderContents(`${this.workingPath}internal/${this.parserName}/data`)).filter((elem)=>elem.isFile)
      for(let elem of dataContent)
      {
        const data =
            tf.data.csv(`file://${this.workingPath}internal/${this.parserName}/data/${elem.name}`, {
            columnConfigs: {...this.columnConfigs},
            hasHeader : true,
            configuredColumnsOnly : true
          })

        const flattenedDataset =
        data
        .map(({xs, ys}) =>
          {
            // Convert xs(features) and ys(labels) from object form (keyed by
            // column name) to array form.
            // xs.Truck = truckToLoad[xs.Truck]
            // xs.MaterialType = materialType[xs.MaterialType]
            // const returnobject = {xs:Object.values(xs), ys:Object.values(ys)};

            return {xs:Object.values(xs), ys:Object.values(ys)};
          })
        .batch(300);

        trainingData.push(flattenedDataset)


        let info = await model.fitDataset(flattenedDataset,
          {epochs:10,
          callbacks:{
              onEpochEnd: async(epoch, logs) =>{
                  console.log("Epoch: " + epoch )
                  console.log("logs" ,JSON.stringify(logs,null,2))
              }
          }});
          console.log("Fit done")

        console.log(info.history.acc)


      }
      debugger
    // trainingData =
    // }
    }

  },
  computed:{
    ...mapState(["workingPath"]),
    ...mapGetters([
        'parserFiles'
    ]),
    layerCount: function(){``
      return 2 + this.model.hidenLayers.length
    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table-container {
  max-height: 400px;
  overflow-y: scroll;
}
.grey-back {
  background-color: #dddddd
}

.blue {
  color: rgb(0,0,255)
}
.btn{
  padding-left: 5px;
  margin-left: 5px;
}

</style>
