
<template>
  <div>
    <h3>{{ meta.name }}</h3>

    <div v-if="meta.isNumber" class="text-start">
        <br>
          <b>stats:</b> {{JSON.stringify(meta.stats, null, 2)}}
        <br>
        <br>
        <div class="mb-3 row">
          <label for="max" class="col-sm-2 col-form-label">Normalise Max</label>
          <div class="col-sm-8">
            <input type="number"  class="form-control" id="max" v-model="normalise.max">
          </div>
          <div id="mlp" class="form-text">
             Values higher than the max will be discarded from the dataset
          </div>
        </div>
        <div class="mb-3 row">
          <label for="min" class="col-sm-2 col-form-label">Normalise Min</label>
          <div class="col-sm-8">
            <input type="number"  class="form-control" id="min" v-model="normalise.min">
          </div>
          <div id="minHelp" class="form-text">
             Values lower than the min will be discarded from the dataset
          </div>
        </div>

    </div>
    <div v-else class="text-start">

      <div id="mlp" class="form-text">
        Select how the model will treat text values, "discrete" means each value gets its own input, "normalise" will convert each text entry between a value of 0 to 1 adding only one input to the model
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value="discrete" v-model="normalise.stringType">
        <label class="form-check-label" for="flexRadioDefault1">
          Discrete
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="normalise" v-model="normalise.stringType">
        <label class="form-check-label" for="flexRadioDefault2">
          Normalise
        </label>
      </div>
    </div>
    <br>
    <button type="button" class="btn btn-primary" @click="save()">Save </button>
    <button type="button" class="btn btn-secondary" @click='$emit("cancel")'>Cancell</button>

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

      this.normalise.max = this.meta.stats.max
      this.normalise.min = this.meta.stats.min
    }else {
      this.normalise.stringType = "normalise"
    }


  },
  data: function(){
    return {
      normalise : {
        max : 0,
        min : 0
      }
    }

  },
  methods:{
    save : function(){
      this.normalise.max = parseInt(this.normalise.max)
      this.normalise.min = parseInt(this.normalise.min)
      this.$emit('save',this.normalise)

    },
    cancellAddInput: function(){

      this.$emit("cancel")
    }


  },
  computed:{


  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.btn{
  padding-left: 15px;
  margin-left: 15px;
}

</style>
