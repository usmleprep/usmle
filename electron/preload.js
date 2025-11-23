const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // License management
    activateLicense: (licenseKey) => ipcRenderer.invoke('activate-license', licenseKey),
    checkLicense: () => ipcRenderer.invoke('check-license'),
    getMachineId: () => ipcRenderer.invoke('get-machine-id'),

    // Listen for license status updates
    onLicenseStatus: (callback) => {
        ipcRenderer.on('license-status', (event, data) => callback(data));
    }
});
