
<template>
  <div class="container">
     <select-folder v-on:new-path="updatePath"  v-bind:path="workingPath" heading="Select Working Folder">

     </select-folder>
     <br><br>
    <folder-content>

    </folder-content>



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
    console.log('a is: ' + this.workingPath)
          this.$store.dispatch("setWorkingPath",{value:this.workingPath})

  },
  data: function(){
    return{
      process : process
    }
  },
  methods:{
    updatePath: function(newPath){
      console.log("home got new path")
      console.log(newPath);
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
