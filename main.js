const path = require("path");
const os = require("os");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const { compress } = require("compress-images/promise");

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isLinux = process.platform === "linux" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: isDev ? 1000 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev ? true : false,
    backgroundColor: "white",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  //mainWindow.loadURL('https://twitter.com')

  //mainWindow.loadURL(`file://${__dirname}/app/index.html`)

  mainWindow.loadFile(`${__dirname}/app/index.html`);
};

/**
 * AboutWindow
 */

const createAboutWindow = () => {
  aboutWindow = new BrowserWindow({
    title: "About ImageShrink",
    width: 300,
    height: 300,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: false,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  aboutWindow.loadFile(`${__dirname}/app/about.html`);
};

app.whenReady().then(() => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  /*globalShortcut.register("CmdOrCtrl+R", () => {
    mainWindow.reload();
  });

  globalShortcut.register(isMac ? "Command+Alt+I" : "Ctrl+Shift+I", () => {
    mainWindow.toggleDevTools();
  });*/

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

/**
 * IPC MAIN
 */
ipcMain.on("image:minimize", (e, options) => {
  options.dest = path.join(os.homedir(), "imageshrink/");
  shrinkImage(options);
});

const shrinkImage = async ({ imgPath, quality, dest }) => {
  try {
    const pngQuality = quality / 100;
    imgPath = imgPath.replace(/\\/g, "/");
    const result = await compress({
      source: imgPath,
      destination: dest,
      enginesSetup: {
        jpg: { engine: "mozjpeg", command: ["-quality", quality] },
        png: { engine: "pngquant", command: ["--quality=" + quality, "-o"] },
      },
    });
  } catch (e) {
    console.log(e);
  }

  shell.openPath(dest);
};
