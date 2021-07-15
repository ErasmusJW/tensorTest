
<template>
  <div>
    <h3>{{ meta.name }}</h3>

    <div v-if="meta.isNumber" class="text-start">
        <br>
        <b>stats:</b> {{JSON.stringify(meta.stats, null, 2)}}
        <br>

        <br>
        <div class="mb-3 row">
          <label for="normalMax" class="col-sm-2 col-form-label">Normalise Max</label>
          <div class="col-sm-8">
            <input type="number"  class="form-control" id="normalMax" v-model="normalMax">
          </div>
          <div id="normalMaxHelp" class="form-text">
             Values higher than the max will be discarded from the dataset
          </div>
        </div>
        <div class="mb-3 row">
          <label for="normalMin" class="col-sm-2 col-form-label">Normalise Min</label>
          <div class="col-sm-8">
            <input type="number"  class="form-control" id="normalMin" v-model="normalMin">
          </div>
          <div id="normalMinHelp" class="form-text">
             Values lower than the min will be discarded from the dataset
          </div>
        </div>

    </div>

  </div>

</template>

<script>
/* eslint-disable */
const {dialog} = require('electron').remote;

import { mapGetters, mapState } from 'vuex';



// // Importing dialog module using remote
// const dialog = electron.remote.dialog;
let data = null;

export default {
  name: 'config-input',
  props: {
    meta : Object

  },
  created: function () {
    if(this.meta.isNumber) //christ should realy have 2 components
    {
      this.normalMax = this.meta.stats.max
      this.normalMin = this.meta.stats.min
    }


  },
  data: function(){
    return {
        normalMax : 0,
        normalMin : 0
    }

  },
  methods:{
    selsctInput : function(metaIndex){
      let temp = this.meta[metaIndex];
      this.inputs[metaIndex] = temp
      delete this.selectable[metaIndex];
      Object.assign(this.selectable,this.selectable)
      this.$forceUpdate(); //christ this is a hackey mess
      this.myModal.show()
      console.log(temp)
    }



  },
  computed:{


  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
