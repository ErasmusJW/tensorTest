import Vue from 'vue'
import Vuex from 'vuex'

import fs from "fs/promises"
import md5File from 'md5-file'


Vue.use(Vuex)
const fsDetailsMethods = [ 'isDirectory', 'isFile'];

export default new Vuex.Store({
  state: {
    workingPath : process.env.workingPath || "/home/jac/tensorflow/data",
    workingPathContent: [],
    readWorkingPathStatus: ""
  },
  getters: {
    files: state => {
        return state.workingPathContent.filter(item => item.isFile)

    },
    folders: state => {
      return state.workingPathContent.filter(item => item.isFolder)
  }
  },
  mutations: {
    workingPath (state,data) {
      console.log("mutations",data)
      state.workingPath = data.value;
    },
    setworkingPathContent (state,data) {
      state.workingPathContent = data.value;
    },
    setreadWorkingPathStatus (state,data) {
      state.readWorkingPathStatus = data.value;
    }
  },
  actions: {
    async setWorkingPath (context,path) {
      context.commit('workingPath',path)
      context.dispatch('processWorkingPath')
    },
    async processWorkingPath (context) {
      context.commit("setreadWorkingPathStatus",{value:"Reading"})

      try{
        let workingPathContent =  await fs.readdir( context.state.workingPath,{withFileTypes :true})
        workingPathContent = workingPathContent.map(d => {
          let cur = { name: d.name }
          for (let method of fsDetailsMethods) cur[method] = d[method]()
          return cur
        })



        context.commit("setreadWorkingPathStatus",{value:"Done"})

        //
        context.dispatch("basicFileStats",{value:workingPathContent})
      }catch(e){
        console.log(e)
        context.commit("setworkingPathContent",{value:[]})
        context.commit("setreadWorkingPathStatus",{value:"Error"})

      }

    },
    async readAppdats (context) {


    },
    async basicFileStats (context,data) {

      for(let file of data.value)
      {
        if(file.isFile){
          file.hash = await md5File(`${context.state.workingPath}/${file.name}`)
          file.size = (await (await fs.stat(`${context.state.workingPath}/${file.name}`)).size / (1024*1024)).toFixed(3)
        }
      }
      context.commit("setworkingPathContent",data)



    }
  },
  modules: {
  }
})
