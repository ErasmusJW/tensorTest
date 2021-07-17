
<template>
  <div>
    <h2>New Parser for {{files[$route.params.id].name}}</h2>
    <br>
    <h4>Status: </h4><i>{{status}}</i>
    <br>  <br>  <br>
    <div class="spinner-border text-primary" role="status" v-if="!meta">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else class="row">
      
        <div class="mb-3 row">
          <label for="parserName" class="col-sm-2 col-form-label">Parser Name</label>
          <div class="col-sm-4">
            <input type="text"  class="form-control" id="parserName" v-model="parserName">
          </div>
          <div class="col"> 
            <button class="btn btn-success"  @click="saveParser"> save </button>
          </div>
        </div>

      <div class="row"> 
        <h4> Available Fields </h4> <br> <br>
        <div class="table-container">

          <table class="table">
            <thead>
              <tr>
                <th scope="col">Field Name</th>
                <th scope="col"> Type </th>
                <th scope="col">Min</th>
                <th scope="col">Max</th>
                <th scope="col">Unique Elements</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in selectable" >
                <td scope="row" > {{ index }}</td>
                <template v-if="item.isNumber">
                  <td>Number</td>
                  <td>{{item.stats.min}}</td>
                  <td>{{item.stats.max}}</td>
                  <td class="grey-back"></td>
                </template>
                <template v-else>
                  <td>Sring</td>
                  <td class="grey-back"></td>
                  <td class="grey-back"></td>
                  <td @click="print(item.stats.values)"> <button type="button" class="btn btn-link">{{ Object.keys(item.stats.values).length }}</button>  </td>
                </template>
                <td>
                   <button class="btn btn-outline-primary btn-sm" @click="showselectInput(index)">Select Input </button>
                   <button class="btn btn-outline-warning btn-sm" @click="showselectOutput(index)">Select Output </button>
                </td>
              </tr>

            </tbody>
          </table>

          
        </div>
      </div>
      <div class="row" style="height : 50px">
      </div>



      <div class="row"> 

        <h4> Selected Inputs </h4> <br> <br>
        <div class="table-container">

          <table class="table">
            <thead>
              <tr>
                <th scope="col">Field Name</th>
                <th scope="col">Type </th>
                <th scope="col">Normal Min</th>
                <th scope="col">Nomrmal Max</th>
                <th scope="col">Discrete or Normalise</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in inputs" >
                <td scope="row" > {{ index }}</td>
                <template v-if="item.isNumber">
                  <td>Number</td>
                  <td>{{item.normalise.min}}</td>
                  <td>{{item.normalise.max}}</td>
                  <td class="grey-back"></td>
                </template>
                <template v-else>
                  <td>Sring</td>
                  <td class="grey-back"></td>
                  <td class="grey-back"></td>
                  <td>  {{ item.normalise.stringType }} </td>
                </template>
                <td>
                   <button class="btn btn-outline-primary btn-sm" @click="removeInput(index)">Remove Input </button>
                   <button class="btn btn-outline-warning btn-sm" @click="showselectOutput(index)">Edit Input </button>
                </td>
              </tr>

            </tbody>
          </table>

          
        </div>
      </div>


      <div class="row" style="height : 50px">
      </div>

      <div class="row"> 

        <h4> Selected Outputs </h4> <br> <br>
        <div class="table-container">

          <table class="table">
            <thead>
              <tr>
                <th scope="col">Field Name</th>
                <th> Actions </th>
   
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in outputs" >
                <td scope="row" > {{ index }}</td>

                <td>
                   <button class="btn btn-outline-primary btn-sm" @click="removeOutput(index)">Remove Output </button>
                </td>
              </tr>

            </tbody>
          </table>

          
        </div>
      </div>


      <div class="row" style="height : 50px">
      </div>

      <div>

      </div>


    </div>
    <div class="modal fade" id="createInput" tabindex="-1" >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-body" v-if="showInput">
            <config-input v-bind:meta="inputBeingSelected" v-on:cancel="cancelAddInput()" v-on:save="saveInput"> </config-input>
          </div>
        </div>
      </div>
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

  },
  created: function () {

    this.status = "Attempting to read file";
    this.fileReader = new readFile(`${this.workingPath}/${this.files[this.$route.params.id].name}`,this.dateFieldName,this.dateFiledParser)
    this.fileReader.readData();
    this.fileReader.on("lineUpdate",(val)=>{
      this.status = `Reading line ${val}`;
    })
    this.fileReader.on("done",(val)=>{
      this.status = `Done reading ${val} Lines !`;
     // this.data = this.fileReader.data;
      
      this.headings = this.fileReader.headings;
      let temp = this.fileReader.meta

      for(let metaObject in temp)
      {
        let ob = temp[metaObject]
        ob.name = metaObject
      }
      this.meta = temp
      this.selectable =temp
      this.myModal = new bootstrap.Modal(document.getElementById('createInput'),{backdrop:"static"})
    })
  },
  data: function(){
    return {
      status: "",
      fileReader : {},
      dateFieldName : "FullShiftName",
      dateFiledParser : (val)=>val.substring(0,11),
      data : {},
      headings : [],
      meta : null,
      selectable : null,
      inputs : {},
      outputs : {},
      myModal : null,
      showInput : false,
      inputBeingSelected : null,
      parserName: "Some name"
      
    }

  },
  methods:{
    showselectInput : function(metaIndex){
      this.inputBeingSelected = this.meta[metaIndex];
      this.showInput = true;

      this.myModal.show()

    },
    showselectOutput : function(metaIndex){
       let temp = this.selectable[metaIndex];
       this.outputs[metaIndex] = temp ;
       delete this.selectable[metaIndex]
      this.$forceUpdate()


    },
    cancelAddInput : function(){
      this.myModal.hide()
      this.showInput = false;
      this.inputBeingSelected = null;

    },
    saveInput : function(normalise){

      let temp = this.inputBeingSelected ;
      temp.normalise = normalise
      this.inputs[temp.name] = temp
      delete this.selectable[temp.name];
  
      this.myModal.hide()
      this.showInput = false;
      this.inputBeingSelected = null;

    },
    print : function(data){
      console.log(data)
    },
    removeInput : function(index){
      let temp = this.inputs[index];
      this.selectable[index] = temp ;
      delete this.inputs[index]
      this.$forceUpdate(); //christ this is a hackey mess

    },
    removeOutput : function(index){
       let temp = this.outputs[index];
       this.selectable[index] = temp ;
       delete this.outputs[index]
      this.$forceUpdate()
    },
    saveParser : async function(){
      this.status = "Saving Parser"
      if(Object.keys(this.inputs).length == 0 || Object.keys(this.outputs).length ==  0)
      {
        return console.error("Inputs and outputs need to have values")
      }
      try{
        let dataParser = new parseData( {
          data : this.fileReader.data, 
          meta:this.meta, 
          inputs:this.inputs, 
          outputs:this.outputs, 
          path:this.workingPath, 
          name:this.parserName, 
          filename: `${this.files[this.$route.params.id].name}`
          })
          await dataParser.saveParser();
          this.status = "Parser Saved, saving normalised data"
          await dataParser.normaliseData();
      }
      catch(e)
      {
          this.status = ` saving parser failed ${e}`
          console.error(e)
      }
    }



  },
  computed:{
    ...mapState(["workingPath"]),
    ...mapGetters([
        'files'
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
.btn{
  padding-left: 5px;
  margin-left: 5px;
}

</style>
