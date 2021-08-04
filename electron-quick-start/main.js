// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const tf = require('@tensorflow/tfjs-node');

const parh = require("path");
const { decodeGif } = require('@tensorflow/tfjs-node/dist/image');

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.





let trainingData
let goodCount = 0;
let badCount = 0;

async function loadData({filePath = path.join(__dirname,'/data/fudgeNumbers.csv')}){
  console.log(filePath)
  let inputs = [
    // "Truck",
    // "Excav",
    // "EmptyTravelDuration",
    // "FullTravelDuration",
    // "ShovelIdleTime",
    // "MaterialType"
    "Tons"
  ]

  let outputs = [
    // "EmptyTravelDuration",
    // "SpotTime",
    // "LoadingTime",
    // "FullTravelDuration",
    "DumpingTime"
    // "Tons"
  ]

  const columnConfigs = {};

  for(const elem of inputs){
    columnConfigs[elem] = {
      isLabel:false
    }
  }

  for(const elem of outputs){
    columnConfigs[elem] = {
      isLabel : true
    }

  }



   trainingData = tf.data.csv(`file://${filePath}`, {
    columnConfigs: {...columnConfigs},
    hasHeader : true,
    configuredColumnsOnly : true
  });


  const numOfFeatures = (await trainingData.columnNames()).length - outputs.length;


  const model = tf.sequential();
  model.add(tf.layers.dense({inputShape: [numOfFeatures], units: 1}))


  model.compile({loss: 'meanSquaredError', optimizer: 'sgd',  metrics: ['accuracy']});



  const flattenedDataset =
  trainingData
  .map(({xs, ys}) =>
    {
      // Convert xs(features) and ys(labels) from object form (keyed by
      // column name) to array form.
      // xs.Truck = truckToLoad[xs.Truck]
      // xs.MaterialType = materialType[xs.MaterialType]
      // const returnobject = {xs:Object.values(xs), ys:Object.values(ys)};

      return {xs:Object.values(xs), ys:Object.values(ys)};
    }).filter((x)=>{
      for(num in x.xs)
      {

        if( typeof x.xs[num] !== 'number' )
        {
          badCount++
          return false
        }
      }
      for(num in x.xy)
      {
        if( typeof x.ys[num] !== 'number' )
        {

          badCount++;
          return false
        }
      }
      goodCount++

      return true
    })
  .batch(3);

  let info = await model.fitDataset(flattenedDataset,
    {epochs:10,
     callbacks:{
         onEpochEnd: async(epoch, logs) =>{
             console.log("Epoch: " + epoch + " Loss: " + logs);
         }
     }});
     console.log("Fit done")

  console.log(info.history.acc)


  console.log("prediction",model.predict(tf.tensor2d([40], [1, 1])).dataSync());

  const prediction = model.predict(tf.tensor2d([50], [1, 1]));

  prediction.print();
}


//loadData({});
(async()=>{
  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training. (y = 2x)
  const xs = tf.tensor2d([-0.1, 0, 0.2, 0.3, 0.4, 0.5, 0.8, 2], [8, 1]);
  const ys = tf.tensor2d([-0.2, 0, 0.4, 0.6, 0.8, 1,   1.6, 4], [8, 1]);

  // const xs = tf.tensor2d([10, 0, 20, 30, 40, 50, 80], [7, 1]);
  // const ys = tf.tensor2d([20, 0, 40, 60, 80, 100,160], [7, 1]);

  // Train the model using the data.
  await model.fit(xs, ys, {epochs: 200});
  console.log(model.predict(tf.tensor2d([0.7], [1, 1])).dataSync());
})()
const materialType = {
  "MGO" : 0.5,
  "Waste": 1,
}

const truckToLoad = {
"DT32":200,
"DT33":200,
"DT34":200,
"DT35":200,
"DT36":200,
"DT37":200,
"DT38":200,
"DT39":200,
"DT40":200,
"DT41":200,
"DT42":200,
"DT43":200,
"DT44":200,
"DT45":200,
"DT46":298,
"DT47":298,
"DT48":298,
"DT49":298,
"DT50":298,
"DT52":298,
"DT53":298,
"DT54":298,
"DT55":298,
"DT56":298,
"DT58":298,
"DT59":298,
"DT60":298,
"DT61":298,
"DT62":298,
"DT63":298,
"DT64":298,
"DT65":298,
"DT66":298,
"DT67":298,
"DT68":298,
"DT69":298,
"DT70":298,
"DT71":298,
"DT72":298,
"DT73":298,
"DT74":298,
"DT75":298,
"DT76":298,
"DT77":298,
"DT78":298,
"DT79":298,
"DT80":298,
"DT83":298
}

