const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { validateLicense, storeLicense, getLicense } = require('./license/validator');

let mainWindow;
let isLicensed = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        show: false
    });

    // Load the app
    if (app.isPackaged) {
        // Production: load built files
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        // Development: load from Vite dev server
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

async function checkLicense() {
    const license = getLicense();

    if (!license) {
        console.log('No license found');
        return false;
    }

    const validation = await validateLicense(license);
    return validation.valid;
}

app.whenReady().then(async function () {
    // Check license before creating window
    isLicensed = await checkLicense();

    createWindow();

    // Send license status to renderer
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('license-status', { licensed: isLicensed });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// IPC Handlers
ipcMain.handle('activate-license', async (event, licenseKey) => {
    try {
        const validation = await validateLicense(licenseKey);

        if (validation.valid) {
            storeLicense(licenseKey);
            isLicensed = true;
            return { success: true, message: 'License activated successfully!' };
        } else {
            return { success: false, message: validation.error || 'Invalid license key' };
        }
    } catch (error) {
        console.error('License activation error:', error);
        return { success: false, message: 'Activation failed. Please try again.' };
    }
});

ipcMain.handle('check-license', async () => {
    return { licensed: isLicensed };
});

ipcMain.handle('get-machine-id', async () => {
    const { machineIdSync } = require('node-machine-id');
    try {
        return { id: machineIdSync() };
    } catch (error) {
        console.error('Failed to get machine ID:', error);
        return { id: null };
    }
});
