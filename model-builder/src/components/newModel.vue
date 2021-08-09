
<template>
   <div>
    <h2>Models for {{parserFiles[$route.params.id].name}}</h2>
    inputShape {{inputShape}};
    discreteInuts {{discreteInuts}};
    normalisedInputs {{normalisedInputs}};
    numberOfOutputs {{numberOfOutputs}}
    <div v-if="model">

        <div class="mb-3 row">
          <label for="modelName" class="col-sm-2 col-form-label">Name</label>
          <div class="col-sm-8">
              <input type="text"  class="form-control" id="modelName" v-model="model.name">
          </div>
        </div>
        <div class="mb-3 row">
          <label for="modelName" class="col-sm-2 col-form-label">Optimizer</label>
          <div class="col-sm-8">
              <select v-model="model.optimizer" class="form-select">
                <option v-for="option in optimizers "  v-bind:value="option[0]">{{ option[1] }} </option>
              </select>
          </div>
        </div>
        <div class="mb-3 row">
          <label for="modelName" class="col-sm-2 col-form-label">Loss</label>
          <div class="col-sm-8">
              <select v-model="model.loss" class="form-select">
                <option v-for="option in loss " >{{ option }} </option>
              </select>
          </div>
        </div>
        <br>

        <div class="col text-end">
          <button type="button" class="btn btn-link" @click="addHidenLayer(model)">Add hidden layer</button>
        </div>

        <div class="col text-start">
          <h5>Layers: {{ layerCount }}</h5>
        </div>
        <!-- input -->
        <div class="card" >
          <div class="card-body text-start">
              <div class="row">
                <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Type: </b>
                </div>
                <div class="col-sm-6">
                    Input
                </div>
                <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="The first layer of the model">?</span>
                </div>
              </div>
              <br>

              <div class="row">
                <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>inputShape  : </b>
                </div>
                <div class="col-sm-6">
                    <input type="number" class="form-control" v-model="model.inputLayer.inputShape"  disabled>
                </div>
                <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="Number of inputs in model, defined by parser">?</span>
                </div>
              </div>

              <br>
              <div class="row">
                <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Units  : </b>
                </div>
                <div class="col-sm-6">
                    <input type="number" class="form-control" v-model="model.inputLayer.units"  >
                </div>
                <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="Dimensionality of the output space">?</span>
                </div>
              </div>

              <br>
              <div class="row">
                <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Activation Func  : </b>
                </div>
                <div class="col-sm-6">
                    <select v-model="model.inputLayer.activation" class="form-select">
                      <option v-for="option in activationFunctionOptions ">{{ option }} </option>
                    </select>
                </div>
                <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="Activation function to use">?</span>
                </div>
              </div>

          </div>
        </div>
        <br>


        <!-- hidden layers -->
        <div class="card" v-for="(layer,index) in model.hidenLayers" >
          <div class="card-body text-start">
              <div class="row">
                <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Type: </b>
                </div>
                <div class="col-sm-6">
                    Hiden {{index + 1}}
                </div>
                <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="A hidden layer">?</span>
                </div>
              </div>
              <br>
              <div class="row">
                <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Units  : </b>
                </div>
                <div class="col-sm-6">
                    <input type="number" class="form-control" v-model="layer.units" >
                </div>
                <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="Number unit in layer">?</span>
                </div>
              </div>
              <br>
              <div class="row">
                <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Activation Func  : </b>
                </div>
                <div class="col-sm-6">
                    <select v-model="layer.activation" class="form-select">
                      <option v-for="option in activationFunctionOptions ">{{ option }} </option>
                    </select>
                </div>
                <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="Activation function to use">?</span>
                </div>
              </div>
              <br>
              <div class="row text-end">
                <button type="button" class="btn btn-link" @click="removeHidenLayer(model,index)">Remove Layer</button>
              </div>
          </div>
        </div>
        <br>
        <br>

        <!-- output -->
        <div class="card" >
          <div class="card-body text-start">
              <div class="row">
                <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Type: </b>
                </div>
                <div class="col-sm-6">
                    Output
                </div>
                <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="The first layer of the model">?</span>
                </div>
              </div>
              <br>
              <div class="row">
                <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Units  : </b>
                </div>
                <div class="col-sm-6">
                    <input type="number" class="form-control" v-model="model.outputLayer.units" disabled >
                </div>
                <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="Number of outputs defined by the parser">?</span>
                </div>
              </div>
              <br>
          </div>
          <br>
        </div>
      <br>
      <button type="button" class="btn btn-success" @click="saveModel()">Save</button>
      <br>
      <br>
    </div>
   </div>
</template>

<script>
/* eslint-disable */
const {dialog} = require('electron').remote;

import { mapGetters, mapState } from 'vuex';
import readFile from './readFile'
import readline from 'readline';
import fs from "fs/promises"
import configInput from './configInput.vue';
import parseData from './parseData'

import * as tf from '@tensorflow/tfjs-node'



// // Importing dialog module using remote
// const dialog = electron.remote.dialog;
let data = null;


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

export default {
  components: { configInput },
  name: 'new-sanitise',
  props: {
    modelIn : {}

  },
  created: async function () {
    
    this.filePath = `${this.workingPath}internal/${this.parserFiles[this.$route.params.id].name}`;
    let parserRaw = await fs.readFile(this.filePath, 'utf8')
    this.parser =  JSON.parse(parserRaw);
    console.log("parser",this.parser)
    if(this.modelsIn)
      this.models = this.modelsIn
    this.inputShape = 0;
    this.discreteInuts = 0;
    this.normalisedInputs = 0;
    this.numberOfOutputs = 0;

    for(let inputName in this.parser.inputs){
      const input = this.parser.inputs[inputName]
      if(input.isNumber){
        this.inputShape++
        this.normalisedInputs++
        continue;
      }
      if(input.normalise.stringType === "normalise")
      {
        this.inputShape++
        this.normalisedInputs++
        continue;
      }
      if(input.normalise.stringType === "discrete")
      {

        this.inputShape += Object.keys(input.stats.values).length;
        this.discreteInuts +=  Object.keys(input.stats.values).length;
        continue;
      }
      throw new Error(`unkown input for ${inputName}`)
    }

    for(let outputName in this.parser.outputs){
      const output = this.parser.outputs[outputName]
      if(output.isNumber){
        this.numberOfOutputs++
        continue;
      }
      if(output.normalise.stringType === "normalise")
      {
        this.numberOfOutputs++
        continue;
      }
      if(output.normalise.stringType === "discrete")
      {
        this.numberOfOutputs +=  Object.keys(output.stats.values);
        continue;
      }
      throw new Error(`unkown output for ${outputName}`)
    }

    if(this.modelIn)
      this.model = modelIn
    else
      this.model = {
        name : "unnamedModel",
        complete : false,
        inputLayer :{
          inputShape : this.inputShape,
          units: this.inputShape,
          activation : 'relu'
        },

        outputLayer :{
          units: this.numberOfOutputs,
        },

        hidenLayers : [],
        optimizer: "sgd",
        loss: "meanSquaredError",
        metrics: "accuracy"

      }


  },
  data: function(){
    return {
      filePath : "",
      parser : {},
      model: null,
      inputShape: "not calculated",
      discreteInuts: "not calculated",
      normalisedInputs: "not calculated",
      activationFunctionOptions : ['elu','hardSigmoid','linear','relu','relu6', 'selu','sigmoid','softmax','softplus','softsign','tanh','swish','mish'],
      numberOfOutputs : "not calculated",
      optimizers: [
        ["sgd","stochastic gradient descent"],
        ["momentum","momentum gradient descent"],
        ["adagrad","Adagrad algorithm"],
        ["adadelta","Adadelta algorithm"],
        ["adam","Adam algorithm"],
        ["adamax ","Adamax algorithm"],
        ["rmsprop","RMSProp gradient descent"]
      ],
      loss : [
        "absoluteDifference",
        "computeWeightedLoss",
        "cosineDistance",
        "hingeLoss",
        "huberLoss",
        "logLoss",
        "meanSquaredError",
        "sigmoidCrossEntropy",
        "softmaxCrossEntropy"
      ]
    }

  },
  methods:{
    print: function(data){
      console.log(data)
    },
    addHidenLayer: function(model){
      model.hidenLayers.push({
          units: this.inputShape,
          activation : 'relu'
      })
    },
    removeHidenLayer: function(model,index){
      model.hidenLayers.splice(index,1)
    },
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
      await ensureFolder(`${this.workingPath}internal`)
      let path =  `${this.workingPath}internal/${this.parserFiles[this.$route.params.id].name}`

      path = `${path.substring(0,path.indexOf(".json"))}`
      await ensureFolder(path)
      path += `/models`
      await ensureFolder(path)
      path += `/${this.model.name}`
      await ensureFolder(path)


      try{
        let doesExists = (await fs.stat(path)).isDirectory()
        if(!doesExists)
          await fs.mkdir(path)
      }catch(e)
      {
        await fs.mkdir(path)
      }
      await fs.writeFile(`${path}/config.json`, JSON.stringify(this.model,null,2), 'utf8');
      await this.makeModel(path)
      alert("model saved");
    }



  },
  computed:{
    ...mapState(["workingPath"]),
    ...mapGetters([
        'parserFiles'
    ]),
    layerCount: function(){
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
