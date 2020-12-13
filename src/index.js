const { app, BrowserWindow } = require('electron');
const os = require('os-utils');
const path = require('path');
const si = require("systeminformation")
const moment = require("moment")

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 300,
    icon: __dirname + '/icon.ico',
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setMenuBarVisibility(false)
  setInterval(() => {
    si.cpu(async function(v){
      var rawUptime = os.sysUptime()
      // var seconds = moment.duration(rawUptime).seconds();
      // var minutes = moment.duration(rawUptime).minutes();
      // var hours = Math.trunc(moment.duration(rawUptime).asHours());
      // var uptime = `${hours} hrs ${minutes} mins ${seconds} secs`;
      // console.log(rawUptime)
      // let cpuTemp = await si.cpuTemperature()
      let cpuLoad = await si.currentLoad()
      let proc = await si.processes()
      let Mem = await si.mem()
      let network = await si.networkInterfaces()
      // console.log(network)
      // console.log(cpuTemp)
      // console.log(cpuSpeed)
      // mainWindow.webContents.send('cpu',v.speed);
      // console.log(v.speed)
      mainWindow.webContents.send('cpu',cpuLoad.currentload);
      mainWindow.webContents.send('mem',Mem.free/1024/1024/1024);
      // console.log(si.mem().free)
      mainWindow.webContents.send('run-proc',proc.all);
      mainWindow.webContents.send('run-proc',network[0]);
      mainWindow.webContents.send('mem-used',Mem.used/1024/1024/1024);
      mainWindow.webContents.send('uptime',rawUptime/60/60);
    });
  },1000);

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
