
<template>
  <div>
    <h1>New Sanitise</h1>
    <br>
    <h4>Status: </h4><i>{{status}}</i>
    <br>  <br>  <br>
    <div class="spinner-border text-primary" role="status" v-if="!meta">
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-else class="row">
      <div class="col">
        <div class="row text-center">
          <h4>Avaliable fields:</h4>
        </div>
        <div v-for="(item, index) in selectable">

          <div class="card text-start"  >
            <div class="card-body">
                <dl class="row">
                  <dt class="col-6">Name:</dt>
                  <dd class="col-6">{{index}}</dd>
                </dl>
                <dl class="row" v-if="item.isNumber">
                    <dt class="col-6">Type:</dt>
                    <dd class="col-6">Number</dd>

                    <dt class="col-6">min:</dt>
                    <dd class="col-6">{{item.stats.min}}</dd>

                    <dt class="col-6">max:</dt>
                    <dd class="col-6">{{item.stats.max}}</dd>
                </dl>
                <dl class="row" v-else>
                    <dt class="col-6">Type:</dt>
                    <dd class="col-6">Text</dd>

                    <dt class="col-6"># Of unique Values:</dt>
                    <dd class="col-6">{{ Object.keys(item.stats.values).length }}</dd>

                </dl>
                <div class="row text-center">
                  <button class="btn btn-primary" @click="showselectInput(index)"> Input </button>
                </div>
            </div>
          </div>
          <br>

        </div>
      </div>
      <div class="col">
        <div class="row text-center">
          <h4>Inputs field:</h4>
          <div v-for="(item, index) in inputs">
            <p> {{index}} </p>
          </div>
        </div>

      </div>

      <div class="col">
        <div class="row text-center">
          <h4>Output fields:</h4>
        </div>

      </div>


    </div>
    <div class="modal fade" id="createInput" tabindex="-1" >
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-body" v-if="showInput">
            <config-input v-bind:meta="inputBeingSelected"> </config-input>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
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


// // Importing dialog module using remote
// const dialog = electron.remote.dialog;
let data = null;

export default {
  components: { configInput },
  name: 'new-sanitise',
  props: {

  },
  created: function () {

    console.log("$route.params.id ",this.$route.params.id );
    this.status = "Attempting to read file";
    console.log("bootstrap", bootstrap)
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
      this.myModal = new bootstrap.Modal(document.getElementById('createInput'))
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
      myModal : null,
      showInput : false,
      inputBeingSelected : null
    }

  },
  methods:{
    showselectInput : function(metaIndex){
      this.inputBeingSelected = this.meta[metaIndex];
      this.showInput = true;
      // let temp = this.meta[metaIndex];
      // this.inputs[metaIndex] = temp
      // delete this.selectable[metaIndex];
      // Object.assign(this.selectable,this.selectable)
      // this.$forceUpdate(); //christ this is a hackey mess
      this.myModal.show()

    }



  },
  computed:{
    ...mapState(["workingPath"]),
    ...mapGetters([
        'files'
    ])

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
