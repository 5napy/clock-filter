const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
});

ipcMain.handle("open-file", async () => {
  const { filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "CSV", extensions: ["csv"] }],
    properties: ["openFile"],
  });

  if (filePaths.length === 0) return null;

  const content = fs.readFileSync(filePaths[0], "utf-8");
  return content;
});

//xlsx

const XLSX = require("xlsx");

ipcMain.handle("save-xlsx", async (event, data) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: "asistencia.xlsx",
    filters: [{ name: "Excel", extensions: ["xlsx"] }],
  });

  if (!filePath) return null;

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Asistencia");
  XLSX.writeFile(workbook, filePath);

  return true;
});
