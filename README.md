# Admin Panel 2

Web admin portal for Gate Pass management, built with Next.js App Router.

## Stack
- Next.js 16
- React 19
- Firebase Admin SDK (server-side API routes)
- Firestore

## Features
- Role-based user management dashboards
- Manual user creation/edit
- CSV bulk import for users (students, parents, faculty, HOD, principal, security, admission, higher authority, admins/web-admins)
- Department-aware data isolation

## Project Structure
- `app/` - pages and API routes
- `components/` - UI and shared components
- `lib/` - firebase setup, hooks, constants, utilities
- `scripts/` - debugging and migration utilities

## Local Setup
1. Install dependencies:
```bash
npm install
```
2. Create local env file:
```bash
cp .env.example .env.local
```
PowerShell alternative:
```powershell
Copy-Item .env.example .env.local
```
3. Fill Firebase env vars in `.env.local`.
4. Start:
```bash
npm run dev
```
5. Open `http://localhost:3000`

## Build
```bash
npm run build
npm run start
```

## Deployment
Use the deployment guide:
- `DEPLOYMENT.md`

## GitHub Push Guide
Use:
- `GITHUB_SETUP.md`
