const { app, BrowserWindow, Menu } = require("electron");

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isLinux = process.platform === "linux" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev ? true : false,
  });

  //mainWindow.loadURL('https://twitter.com')

  //mainWindow.loadURL(`file://${__dirname}/app/index.html`)

  mainWindow.loadFile(`${__dirname}/app/index.html`);
};

app.whenReady().then(() => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

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
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ],
  },
];
