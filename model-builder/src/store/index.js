import Vue from 'vue'
import Vuex from 'vuex'

import fs from "fs/promises"
import md5File from 'md5-file'


Vue.use(Vuex)
const fsDetailsMethods = [ 'isDirectory', 'isFile'];

async function readFolderContents(path)
{
  let content =  await fs.readdir( path,{withFileTypes :true})
  content = content.map(d => {
    let cur = { name: d.name }
    for (let method of fsDetailsMethods) cur[method] = d[method]()
    return cur
  })
  return content
}

async function fileStat(data,path)
{
  for(let file of data)
  {
    if(file.isFile){
      file.hash = await md5File(`${path}/${file.name}`)
      file.size = (await (await fs.stat(`${path}/${file.name}`)).size / (1024*1024)).toFixed(3)
    }
  }
  return data;
}

export default new Vuex.Store({
  state: {
    workingPath : process.env.workingPath || "/home/jac/tensorTest/data/",
    workingPathContent: [],
    readWorkingPathStatus: "",
    parsersContetn : [],
    parserFolderContent : []
  },
  getters: {
    files: state => {
        return state.workingPathContent.filter(item => item.isFile)

    },
    parserFiles: state => {
      return state.parserFolderContent.filter(item => item.isFile)

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
    setParserContent (state,data) {
      state.parserFolderContent = data.value;
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
        let workingPathContent =  await readFolderContents(`${context.state.workingPath}`)


        context.commit("setreadWorkingPathStatus",{value:"Done"})
        let Stat = await fileStat(workingPathContent,context.state.workingPath)
        context.commit("setworkingPathContent",{value:Stat})

        let parserContetn = await readFolderContents(`${context.state.workingPath}parsers`)

        let parserStat = await fileStat(parserContetn,`${context.state.workingPath}parsers`)
        context.commit('setParserContent',{value:parserStat})
      }catch(e){
        console.log(e)
        context.commit("setworkingPathContent",{value:[]})
        context.commit("setreadWorkingPathStatus",{value:"Error"})

      }

    },

    async processModelContent (context) {


    },
    async readAppdats (context) {


    },
    async basicFileStats (context,data) {





    }
  },
  modules: {
  }
})
