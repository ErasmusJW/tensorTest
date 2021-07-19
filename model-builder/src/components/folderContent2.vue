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
        </tr>
      </thead>
      <tbody>
        <tr v-for="(file,index) in parserFiles">
          <th scope="row">{{index}}</th>
          <td >{{file.name}}</td>
          <td >{{file.size}} Mb</td>
          <td >{{file.hash}}</td>
          <td> <button type="button" class="btn btn-primary" @click="$emit(index)">New Model</button> </td>
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
  name: 'folder-content-parser',
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
        'parserFiles'
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
