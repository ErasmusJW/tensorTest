
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file,index) in files">
          <th scope="row">{{index}}</th>
          <td >{{file.name}}</td>
          <td >{{file.size}} Mb</td>
          <td >{{file.hash}}</td>
          <td> <button type="button" class="btn btn-primary" @click="loadFile(index)">Select</button> </td>
        </tr>

      </tbody>
    </table>

  </div>

</template>

<script>
/* eslint-disable */
const {dialog} = require('electron').remote;

import { mapGetters } from 'vuex';
import readline from 'readline';
import fs from "fs/promises"


// // Importing dialog module using remote
// const dialog = electron.remote.dialog;

export default {
  name: 'folder-content',
  props: {

  },
  created: function () {

  },
  data: function(){
    return {

    }

  },
  methods:{
    loadFile : function(index){

      this.$router.push({ path: `newSanitise/${index}` })

    }

  },
  computed: mapGetters([
        'files'
    ])



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
