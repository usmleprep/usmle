# USMLE Question Bank - GitHub Pages Setup Guide

## 🚀 Quick Start

### 1. Set Up Supabase

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up (free tier is sufficient)
   - Create a new project

2. **Create Database Table**
   - Go to SQL Editor in Supabase dashboard
   - Run this SQL:

```sql
CREATE TABLE authorized_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  active BOOLEAN DEFAULT true
);

-- Add Row Level Security
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for login verification)
CREATE POLICY "Allow public read access" ON authorized_users
  FOR SELECT USING (true);
```

3. **Get API Credentials**
   - Go to Project Settings → API
   - Copy:
     - `Project URL` (looks like: `https://xxxxx.supabase.co`)
     - `anon public` key (safe to expose in client)

4. **Add Environment Variables**
   - Create `.env` file in project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### 2. Add Authorized Emails

**Option A: Using Supabase Dashboard**
1. Go to Table Editor → `authorized_users`
2. Click "Insert row"
3. Enter email address
4. Set `active` to `true`
5. Leave `expires_at` empty (or set expiration date)

**Option B: Using SQL**
```sql
INSERT INTO authorized_users (email, active)
VALUES ('user@example.com', true);
```

---

### 3. Configure GitHub Repository

1. **Update Base Path**
   - Edit `vite.config.js`
   - Change `base: '/questions/'` to match your repo name

2. **Add Secrets to GitHub**
   - Go to your GitHub repo
   - Settings → Secrets and variables → Actions
   - Add two secrets:
     - `VITE_SUPABASE_URL` = your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

3. **Enable GitHub Pages**
   - Settings → Pages
   - Source: "GitHub Actions"

---

### 4. Deploy

**Option A: Automatic (GitHub Actions)**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

The GitHub Action will automatically build and deploy.

**Option B: Manual**
```bash
npm run deploy
```

---

## 📝 Managing Users

### Add User
```sql
INSERT INTO authorized_users (email, active, expires_at)
VALUES ('newuser@example.com', true, '2025-12-31');
```

### Remove User
```sql
UPDATE authorized_users
SET active = false
WHERE email = 'user@example.com';
```

### View All Users
```sql
SELECT email, created_at, expires_at, active
FROM authorized_users
ORDER BY created_at DESC;
```

---

## 🧪 Testing Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env` file** (see step 1.4 above)

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Test login**
   - Open http://localhost:5173
   - Enter an authorized email
   - Should grant access

---

## 🔒 Security Notes

> [!WARNING]
> **Question Data Visibility**
> 
> Since this is a static site, the question data is embedded in the JavaScript bundle. Anyone can view the source code and extract questions. This is a trade-off for simplicity and free hosting.
> 
> **Suitable for:**
> - Trusted user base
> - Non-sensitive content
> - Convenience over maximum security

> [!IMPORTANT]
> **Environment Variables**
> 
> - Never commit `.env` file to Git
> - Add `.env` to `.gitignore`
> - Supabase anon key is safe to expose (it's public)
> - Use Row Level Security policies in Supabase

---

## 📦 Deployment Checklist

- [ ] Supabase project created
- [ ] Database table created with SQL
- [ ] Test emails added to database
- [ ] `.env` file created locally
- [ ] GitHub secrets configured
- [ ] `vite.config.js` base path updated
- [ ] GitHub Pages enabled
- [ ] Code pushed to GitHub
- [ ] Deployment successful
- [ ] Login tested on live site

---

## 🌐 Accessing Your Site

After deployment, your site will be available at:
```
https://yourusername.github.io/repo-name/
```

---

## 🛠️ Troubleshooting

### "Email not authorized" error
- Check email is in Supabase `authorized_users` table
- Verify `active` is `true`
- Check for typos in email

### Supabase connection error
- Verify `.env` variables are correct
- Check GitHub secrets are set
- Ensure Supabase project is active

### GitHub Pages not updating
- Check Actions tab for build errors
- Verify GitHub Pages is enabled
- Wait 2-3 minutes for deployment

### Questions not loading
- Check browser console for errors
- Verify `usmle_questions.json` is in `public/` folder
- Check base path in `vite.config.js`

---

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check GitHub Actions logs
3. Check Supabase logs
4. Verify all environment variables

---

## 🎯 Next Steps

1. **Customize branding** - Update colors, logo, app name
2. **Add more users** - Insert emails into Supabase
3. **Set up analytics** - Track usage (optional)
4. **Add admin panel** - Manage users from within the app
5. **Monitor usage** - Check Supabase dashboard for activity
