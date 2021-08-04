
<template>
  <div class="row">
    <div class="col-2">
        {{heading}}
    </div>
    <div class="col">
      <input type="text"  class="form-control" v-bind:value="path" @input="setInput($event.target.value)">
    </div>
    <div class="col-2">
        <button id="upload" @click="openDownload">Browse</button>
    </div>


     <!-- <input type="file" webkitdirectory  @input="openDownload" /> -->
  </div>

</template>

<script>
/* eslint-disable */
const {dialog} = require('electron').remote;

import remote from "electron"
import { mapState } from 'vuex'

// // Importing dialog module using remote
// const dialog = electron.remote.dialog;

export default {
  name: 'select-folder',
  props: {
    heading: String,
    path: String
  },
  created: function () {

  },
  data: function(){
    return{
      process : process
    }
  },
  methods:{
    openDownload: async function(e){

      const path =   await dialog.showOpenDialog({
          properties: ['openDirectory'],
          defaultPath: this.path
      })

      this.$emit('new-path',path.filePaths[0])

    },
    setInput : function(value){
      this.$emit('new-path',value)
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
