
<template>
  <div>
    <h2>Models for {{parserFiles[$route.params.id].name}}</h2>
     inputShape {{inputShape}};
     discreteInuts {{discreteInuts}};
     normalisedInputs {{normalisedInputs}};
     numberOfOutputs {{numberOfOutputs}}

    <br> <br>    <br>
    <button class="btn-primary" @click="addModel()">Add model</button>
    <br>    <br>    <br>


<svg class="bi" width="32" height="32" fill="currentColor">
  <use xlink:href="bootstrap-icons.svg#heart-fill"/>
</svg>

    <h3>Models</h3>
    <br>
    <div v-if="models.length > 0">
      <div v-for="(model,index) in models">
      <br>
      <h4>{{index}}</h4>
      <div class="card" >
          <div class="card-body text-start">

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
            <div class="row">
                <div class="col">
                  <h5>Layers:</h5>
                </div>


            </div>

            <!-- input -->
            <div class="card" >
              <div class="card-body text-start">

                <div class="row">
                  <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Type: </b>
                  </div>
                  <div class="col-sm-6 col-md-5 col-lg-4">
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
                  <div class="col-sm-6 col-md-5 col-lg-4">
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
                  <div class="col-sm-6 col-md-5 col-lg-4">
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
                  <div class="col-sm-6 col-md-5 col-lg-4">
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
                  <div class="col-sm-6 col-md-5 col-lg-4">
                    Hiden
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
                  <div class="col-sm-6 col-md-5 col-lg-4">
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
                  <div class="col-sm-6 col-md-5 col-lg-4">
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

            <br>

            <!-- output -->
            <div class="card" >
              <div class="card-body text-start">

                <div class="row">
                  <div class="col-sm-5 col-md-3 col-lg-2 text-end">
                    <b>Type: </b>
                  </div>
                  <div class="col-sm-6 col-md-5 col-lg-4">
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
                  <div class="col-sm-6 col-md-5 col-lg-4">
                    <input type="number" class="form-control" v-model="model.outputLayer.units" disabled >
                  </div>
                  <div class="col-sm-1">
                    <span  class="blue" data-bs-toggle="tooltip" data-bs-placement="top" title="Number of outputs defined by the parser">?</span>
                  </div>
                </div>
                <br>



              </div>
            </div>

          </div>
          <br>







      </div>
      <br><br><br>



    </div>

    </div>
    <div v-if="!models.length">
        <i> no models defined yet </i>
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


// // Importing dialog module using remote
// const dialog = electron.remote.dialog;
let data = null;

export default {
  components: { configInput },
  name: 'new-sanitise',
  props: {
    modelsIn : []

  },
  created: async function () {
    this.filePath = `${this.workingPath}parsers/${this.parserFiles[this.$route.params.id].name}`;
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

  },
  data: function(){
    return {
      filePath : "",
      parser : {},
      models: [],
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
    addModel : function(){
      let newModel = {
        name : "",
        complete : false,
        inputLayer :{
          inputShape : [this.inputShape],
          units: [this.inputShape],
          activation : 'relu'
        },

        outputLayer :{
          units: [this.numberOfOutputs],
        },

        hidenLayers : [],
        optimizer: "sgd",
        loss: "meanSquaredError",
        metrics: "accuracy"

      }
      this.models.push(newModel)



    },
    print: function(data){
      console.log(data)
    },
    addHidenLayer: function(model){
      model.hidenLayers.push({
          units: [this.inputShape],
          activation : 'relu'
      })
    },
    removeHidenLayer: function(model,index){
      model.hidenLayers.splice(index,1)
    }



  },
  computed:{
    ...mapState(["workingPath"]),
    ...mapGetters([
        'parserFiles'
    ]),
    saveEnabled: function(){
      return Object.keys(this.inputs).length > 0 && Object.keys(this.outputs).length >  0
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
