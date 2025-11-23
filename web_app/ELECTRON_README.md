# USMLE Question Bank - Electron Desktop App

## 🚀 Quick Start Guide

### Development Mode

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run in Development**
   ```bash
   npm run electron:dev
   ```
   This will start both the Vite dev server and Electron app.

### Building for Distribution

#### Windows
```bash
npm run electron:build:win
```
Output: `release/USMLE Question Bank Setup 1.0.0.exe`

#### macOS
```bash
npm run electron:build:mac
```
Output: `release/USMLE Question Bank-1.0.0.dmg`

#### Linux
```bash
npm run electron:build:linux
```
Output: `release/USMLE Question Bank-1.0.0.AppImage`

---

## 🔑 License System

### Generating License Keys

Use the license generator tool:

```bash
node electron/license/generator.js
```

This will generate three types of licenses:
1. **Simple License** - Works on any machine
2. **Machine-Bound License** - Tied to specific hardware
3. **Time-Limited License** - Expires after set days

### Programmatic License Generation

```javascript
const { generateLicense, generateMachineBoundLicense, generateTimeLimitedLicense } = require('./electron/license/generator');

// Simple license
const license1 = generateLicense({ email: 'customer@example.com' });

// Machine-bound (get machine ID from customer)
const license2 = generateMachineBoundLicense('customer@example.com', 'MACHINE-ID-HERE');

// Time-limited (30 days)
const license3 = generateTimeLimitedLicense('customer@example.com', 30);

console.log(license1); // USMLE-XXXX-XXXX-XXXX-XXXX
```

### License Activation Flow

1. Customer purchases app
2. You generate unique license key
3. Customer downloads installer
4. On first launch, app shows activation screen
5. Customer enters license key
6. App validates and stores encrypted license
7. App unlocks and runs normally

---

## 🔒 Security Features

- **AES-256 Encryption** - License keys are encrypted
- **Machine Binding** - Optional hardware-specific licenses
- **Signature Verification** - Prevents tampering
- **Secure Storage** - Licenses stored in encrypted format
- **Context Isolation** - Electron security best practices

---

## 📦 Distribution

### Recommended Platforms

1. **Gumroad** - Simple, handles payments and delivery
2. **LemonSqueezy** - Modern, merchant of record
3. **Paddle** - Handles international taxes
4. **Your Own Website** - Full control

### Distribution Process

1. Build the app for target platform(s)
2. Upload installer to distribution platform
3. Set up license key generation
4. Configure automated delivery
5. Customer receives download link + license key

---

## 🛠️ Customization

### Change Encryption Key

**IMPORTANT**: Change the encryption key in production!

Edit `electron/license/validator.js` and `electron/license/generator.js`:

```javascript
const ENCRYPTION_KEY = 'YOUR-UNIQUE-SECRET-KEY-HERE';
```

### App Icon

Replace these files in the `public/` directory:
- `icon.ico` (Windows)
- `icon.icns` (macOS)
- `icon.png` (Linux)

### App Metadata

Edit `package.json`:
```json
{
  "name": "your-app-name",
  "productName": "Your App Name",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Your app description"
}
```

---

## 📝 License Key Format

```
USMLE-XXXX-XXXX-XXXX-XXXX
```

- Prefix: `USMLE` (product identifier)
- 4 segments of 4 characters each
- Contains encrypted data:
  - Customer email
  - Issue date
  - Machine ID (optional)
  - Expiration date (optional)
  - Signature for validation

---

## 🧪 Testing

### Test License Activation

1. Run app in development: `npm run electron:dev`
2. Generate test license: `node electron/license/generator.js`
3. Copy generated license key
4. Enter in activation screen
5. Verify app unlocks

### Test Built App

1. Build for your platform
2. Install the generated installer
3. Test activation with fresh license
4. Verify all features work

---

## 🐛 Troubleshooting

### "License validation failed"
- Check encryption key matches in generator and validator
- Verify license format is correct
- Check console for detailed error messages

### "Machine ID mismatch"
- License is bound to different hardware
- Generate new license for current machine
- Or use non-machine-bound license

### App won't start
- Check Node.js version (20.19+ or 22.12+)
- Verify all dependencies installed: `npm install`
- Check console for errors

---

## 📞 Support

For issues or questions:
- Check console logs (Ctrl+Shift+I in dev mode)
- Review `electron/main.js` for main process logs
- Test license generation separately

---

## 🎯 Next Steps

1. **Customize branding** - Update app name, icon, colors
2. **Change encryption key** - Use unique secret key
3. **Test thoroughly** - All platforms and license types
4. **Set up distribution** - Choose platform and configure
5. **Generate licenses** - Create keys for customers
6. **Launch!** - Start selling your app

---

## 📄 License

This application uses a custom license system. Each copy requires a valid license key to activate.
