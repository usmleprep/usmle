const crypto = require('crypto-js');
const { machineIdSync } = require('node-machine-id');

/**
 * Generate a license key
 * @param {Object} options
 * @param {string} options.email - Customer email
 * @param {string} options.machineId - Optional machine ID to bind license
 * @param {Date} options.expiresAt - Optional expiration date
 * @returns {string} - Generated license key
 */
function generateLicense(options = {}) {
    const { email, machineId, expiresAt } = options;

    // Create license data
    const licenseData = {
        email: email || 'customer@example.com',
        issuedAt: new Date().toISOString(),
        machineId: machineId || null,
        expiresAt: expiresAt ? expiresAt.toISOString() : null,
    };

    // Create signature
    licenseData.signature = crypto.SHA256(
        licenseData.email + licenseData.issuedAt
    ).toString();

    // Encrypt the license data
    const ENCRYPTION_KEY = 'USMLE-APP-SECRET-KEY-2024-CHANGE-ME';
    const encrypted = crypto.AES.encrypt(
        JSON.stringify(licenseData),
        ENCRYPTION_KEY
    ).toString();

    // Format as USMLE-XXXX-XXXX-XXXX-XXXX
    const base = encrypted.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const formatted = `USMLE-${base.substr(0, 4)}-${base.substr(4, 4)}-${base.substr(8, 4)}-${base.substr(12, 4)}`;

    return formatted;
}

/**
 * Generate a machine-bound license
 * @param {string} email - Customer email
 * @param {string} machineId - Machine ID to bind to
 * @returns {string} - Generated license key
 */
function generateMachineBoundLicense(email, machineId) {
    return generateLicense({ email, machineId });
}

/**
 * Generate a time-limited license
 * @param {string} email - Customer email
 * @param {number} daysValid - Number of days the license is valid
 * @returns {string} - Generated license key
 */
function generateTimeLimitedLicense(email, daysValid = 365) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysValid);
    return generateLicense({ email, expiresAt });
}

/**
 * Get current machine ID
 * @returns {string} - Machine ID
 */
function getCurrentMachineId() {
    return machineIdSync();
}

// Example usage (for testing)
if (require.main === module) {
    console.log('\n=== USMLE License Generator ===\n');

    // Generate a simple license
    const simpleLicense = generateLicense({ email: 'customer@example.com' });
    console.log('Simple License:');
    console.log(simpleLicense);
    console.log('');

    // Generate a machine-bound license
    const machineId = getCurrentMachineId();
    const boundLicense = generateMachineBoundLicense('customer@example.com', machineId);
    console.log('Machine-Bound License:');
    console.log(boundLicense);
    console.log(`(Bound to machine: ${machineId})`);
    console.log('');

    // Generate a time-limited license (30 days)
    const timeLimitedLicense = generateTimeLimitedLicense('customer@example.com', 30);
    console.log('Time-Limited License (30 days):');
    console.log(timeLimitedLicense);
    console.log('');
}

module.exports = {
    generateLicense,
    generateMachineBoundLicense,
    generateTimeLimitedLicense,
    getCurrentMachineId
};
