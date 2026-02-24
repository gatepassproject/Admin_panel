# GitHub Setup and Push Guide

Use this when your new GitHub repo is created.

## 1. Local Check
From `gatepass/admin_panel2`:

```bash
npm install
npm run build
```

## 2. Initialize Git (if needed)
```bash
git init
git add .
git commit -m "Initial admin_panel2 setup"
```

## 3. Connect Remote
Replace with your repository URL:

```bash
git remote add origin <YOUR_GITHUB_REPO_URL>
```

If remote already exists:

```bash
git remote set-url origin <YOUR_GITHUB_REPO_URL>
```

## 4. Push
```bash
git branch -M main
git push -u origin main
```

## 5. Next Step
After push is complete:
- Connect this repo to Vercel
- Follow `DEPLOYMENT.md`

