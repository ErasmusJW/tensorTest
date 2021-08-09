
<template>
  <div class="container">
     <select-folder v-on:new-path="updatePath"  v-bind:path="workingPath" heading="Select Working Folder">

     </select-folder>
     <br><br>
     <h3>Data</h3>
    <folder-content>

    </folder-content>

    <h3> Parsers </h3>
    <folder-content-parser>

    </folder-content-parser>





    <button @click="updatePath(workingPath)" class="btn btn-primary">Refresh</button>
  </div>





</template>

<script>
/* eslint-disable */

import remote from "electron"
import { mapState } from 'vuex'



// // Importing dialog module using remote
// const dialog = electron.remote.dialog;

export default {
  name: 'home',
  props: {
    msg: String
  },
  created: function () {
    // `this` points to the vm instance

    this.$store.dispatch("setWorkingPath",{value:this.workingPath})

  },
  data: function(){
    return{
      process : process
    }
  },
  methods:{
    updatePath: function(newPath){
      this.$store.dispatch("setWorkingPath",{value:newPath})
    }
  },
  computed: mapState({

    // arrow functions can make the code very succinct!
    workingPath: state => state.workingPath,

  })

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
