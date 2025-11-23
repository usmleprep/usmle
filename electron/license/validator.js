const crypto = require('crypto-js');
const { machineIdSync } = require('node-machine-id');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Secret key for encryption (CHANGE THIS IN PRODUCTION!)
const ENCRYPTION_KEY = 'USMLE-APP-SECRET-KEY-2024-CHANGE-ME';
const LICENSE_FILE = 'license.dat';

/**
 * Get the path to store license data
 */
function getLicensePath() {
    const userDataPath = app.getPath('userData');
    return path.join(userDataPath, LICENSE_FILE);
}

/**
 * Validate a license key
 * @param {string} licenseKey - The license key to validate
 * @returns {Promise<{valid: boolean, error?: string}>}
 */
async function validateLicense(licenseKey) {
    try {
        if (!licenseKey || typeof licenseKey !== 'string') {
            return { valid: false, error: 'Invalid license key format' };
        }

        // Remove spaces and convert to uppercase
        const cleanKey = licenseKey.replace(/\s/g, '').toUpperCase();

        // Check format: USMLE-XXXX-XXXX-XXXX-XXXX
        const keyPattern = /^USMLE-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        if (!keyPattern.test(cleanKey)) {
            return { valid: false, error: 'Invalid license key format' };
        }

        // Extract the encoded data (everything after USMLE-)
        const encodedData = cleanKey.substring(6).replace(/-/g, '');

        try {
            // Decrypt the license data
            const decrypted = crypto.AES.decrypt(encodedData, ENCRYPTION_KEY).toString(crypto.enc.Utf8);

            if (!decrypted) {
                return { valid: false, error: 'Invalid or corrupted license key' };
            }

            const licenseData = JSON.parse(decrypted);

            // Validate expiration date if present
            if (licenseData.expiresAt) {
                const expirationDate = new Date(licenseData.expiresAt);
                if (expirationDate < new Date()) {
                    return { valid: false, error: 'License has expired' };
                }
            }

            // Validate machine binding if present
            if (licenseData.machineId) {
                const currentMachineId = machineIdSync();
                if (licenseData.machineId !== currentMachineId) {
                    return { valid: false, error: 'License is bound to another machine' };
                }
            }

            return { valid: true };
        } catch (decryptError) {
            console.error('Decryption error:', decryptError);
            return { valid: false, error: 'Invalid license key' };
        }
    } catch (error) {
        console.error('License validation error:', error);
        return { valid: false, error: 'Validation failed' };
    }
}

/**
 * Store a validated license
 * @param {string} licenseKey - The license key to store
 */
function storeLicense(licenseKey) {
    try {
        const licensePath = getLicensePath();
        const encryptedLicense = crypto.AES.encrypt(licenseKey, ENCRYPTION_KEY).toString();
        fs.writeFileSync(licensePath, encryptedLicense, 'utf8');
        console.log('License stored successfully');
    } catch (error) {
        console.error('Failed to store license:', error);
        throw error;
    }
}

/**
 * Get stored license
 * @returns {string|null} - The stored license key or null
 */
function getLicense() {
    try {
        const licensePath = getLicensePath();

        if (!fs.existsSync(licensePath)) {
            return null;
        }

        const encryptedLicense = fs.readFileSync(licensePath, 'utf8');
        const decryptedLicense = crypto.AES.decrypt(encryptedLicense, ENCRYPTION_KEY).toString(crypto.enc.Utf8);

        return decryptedLicense || null;
    } catch (error) {
        console.error('Failed to read license:', error);
        return null;
    }
}

/**
 * Remove stored license
 */
function removeLicense() {
    try {
        const licensePath = getLicensePath();
        if (fs.existsSync(licensePath)) {
            fs.unlinkSync(licensePath);
            console.log('License removed');
        }
    } catch (error) {
        console.error('Failed to remove license:', error);
    }
}

module.exports = {
    validateLicense,
    storeLicense,
    getLicense,
    removeLicense
};
