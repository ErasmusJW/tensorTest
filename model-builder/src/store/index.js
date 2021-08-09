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

async function ensureFolder(path) {

  try{
      let doesExists = (await fs.stat(path)).isDirectory()

     if(!doesExists)
         await fs.mkdir(path)


 }catch(e)
 {
     await fs.mkdir(path)
 }
}



export default new Vuex.Store({
  state: {
    workingPath : process.env.workingPath || "/home/jac/tensorTest/data/",
    workingPathContent: [],
    readWorkingPathStatus: "",
    parsersContetn : [],
    parserFolderContent : [],
    models : {}
  },
  getters: {
    files: state => {
        return state.workingPathContent.filter(item => item.isFile)

    },
    parserFiles: state => {
      return state.parserFolderContent.filter(item => item.isFile)

    },
    parserFolders: state => {
      return state.parserFolderContent.filter(item => !item.isFile)

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
    },
    setModels (state,data) {
      state.models = data.value;

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
        await ensureFolder(`${context.state.workingPath}internal`)
        let parserContetn = await readFolderContents(`${context.state.workingPath}internal`)

        let parserStat = await fileStat(parserContetn,`${context.state.workingPath}internal`)
        context.commit('setParserContent',{value:parserStat})
        let models = {}

        for(let file of context.getters.parserFolders)
        {
          let fileContent = await readFolderContents(`${context.state.workingPath}internal/${file.name}`)
          let filestat = await fileStat(fileContent,`${context.state.workingPath}internal/${file.name}`)
          let modelsFolder = filestat.filter((val)=>{
            return val.name == "models" && !val.isFile
          })
          if(modelsFolder.length > 0)
          {
            let fileContent = await readFolderContents(`${context.state.workingPath}internal/${file.name}/models`)
            let filestat = await fileStat(fileContent,`${context.state.workingPath}internal/${file.name}/models`)
            let allModels = filestat.reduce((accum,currentVal)=>{
              if(! currentVal.isFile)
                return [currentVal.name,...accum]
              else
                return [...accum]
            },[])
            if(allModels.length > 0)
              models[file.name] = allModels
          }
          context.commit("setModels",{value:models})
        }
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
