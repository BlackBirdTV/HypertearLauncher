"use strict";

import { app, protocol, BrowserWindow, ipcMain, screen } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import * as child_process from "child_process";
import { Vue } from "vue-class-component";
import * as fs from "fs";
import Store from "electron-store";

let store: Store;

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

let win: Electron.BrowserWindow;

let game_process: child_process.ChildProcess;

async function createWindow() {
  const display = screen.getPrimaryDisplay().workAreaSize;

  store = new Store();

  const options = {
    sizeX: store.get("sizeX") as number,
    sizeY: store.get("sizeY") as number,
    posX: store.get("posX") as number,
    posY: store.get("posY") as number,
  };
  const sizeX = options.sizeX < 500 ? 1050 : options.sizeX;
  const sizeY = options.sizeY < 500 ? 600 : options.sizeY;
  const posX = options.posX < 0 ? display.width / 2 - sizeX / 2 : options.posX;
  const posY = options.posY < 0 ? display.height / 2 - sizeY / 2 : options.posY;
  // Create the browser window.
  win = new BrowserWindow({
    width: sizeX,
    height: sizeY,
    x: posX,
    y: posY,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
    },
  });

  win.on("close", () => {
    store.store = {
      posX: win.getPosition()[0],
      posY: win.getPosition()[1],
      sizeX: win.getSize()[0],
      sizeY: win.getSize()[1],
    };
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e);
    }
  }
  createWindow();
});

ipcMain.on("minimize", () => {
  win.minimize();
});

ipcMain.on("maximize", () => {
  if (win.isMaximized()) {
    console.log("restoring");
    win.restore();
  } else win.maximize();
});

ipcMain.on("close", () => {
  win.close();
});

ipcMain.on("play", () => {
  game_process = child_process.execFile(
    "./src/assets/game/Hyper Tear Demo.exe"
  );
  win.minimize();
  game_process.addListener("exit", () => {
    win.restore();
    win.webContents.send("game-exit");
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
