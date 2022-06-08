const { app, BrowserWindow } = require('electron')

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isLinux = process.platform === 'linux' ? true : false

console.log(process.platform)

let mainWindow

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height: 600,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        resizable: isDev ? true : false
    })

    //mainWindow.loadURL('https://twitter.com')
    
    //mainWindow.loadURL(`file://${__dirname}/app/index.html`)

    mainWindow.loadFile(`${__dirname}/app/index.html`)
}

app.on('ready', createMainWindow)