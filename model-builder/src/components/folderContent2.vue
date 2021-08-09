// Same as folderContetn 1 don't have time to make reusable
<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">FileName</th>
          <th scope="col">Size</th>
          <th scope="col">Hash</th>
          <th scope="col">Actions</th>
          <th scope="col">Models</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file,index) in files">
          <th scope="row">{{index}}</th>
          <td >{{file.baseName}}</td>
          <td >{{file.size}} Mb</td>
          <td >{{file.hash}}</td>
          <td> <button type="button" class="btn btn-primary" @click="loadParser(index)">Add Model</button> </td>
          <td v-if="models[file.baseName]">
            <button v-for="model in models[file.baseName]" @click="useModel(index,model)">
                {{model}}
            </button>
          </td>
        </tr>

      </tbody>
    </table>

  </div>

</template>

<script>
/* eslint-disable */
const {dialog} = require('electron').remote;

import { mapGetters, mapState } from 'vuex';
import readline from 'readline';
import fs from "fs/promises"


// // Importing dialog module using remote
// const dialog = electron.remote.dialog;

export default {
  name: 'folder-content-parser',
  props: {

  },
  created: function () {
      console.log("parserFolders",this.parserFolders)
      console.log("models",this.models.Test1)
  },
  data: function(){
    return {

    }

  },
  methods:{
    loadParser : function(index){

      this.$router.push({ path: `newModel/${index}` })

    },
    useModel : function(index,modelName){
      this.$router.push({ path: `useModel/${index}/${modelName}` })
    }

  },
  computed: {
    ...mapGetters([
        'parserFiles',
        'parserFolders'
    ]),
    ...mapState(["models"]),
    files : function(){
      return this.parserFiles.map((val)=>{
        val.baseName = val.name.substring(0,val.name.indexOf(".json"))
        return val
      })
    }
  }



}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
