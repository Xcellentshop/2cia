import { app, BrowserWindow, ipcMain } from 'electron';
import windowStateKeeper from 'electron-window-state';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let browserWindow;

function createMainWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindowState.manage(mainWindow);
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

function createBrowserWindow(url) {
  if (browserWindow) {
    browserWindow.focus();
    browserWindow.loadURL(url);
    return;
  }

  browserWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });

  browserWindow.loadURL(url);

  browserWindow.on('closed', () => {
    browserWindow = null;
  });
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.on('open-browser', (event, url) => {
  createBrowserWindow(url);
});