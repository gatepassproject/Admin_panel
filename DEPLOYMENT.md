# Admin Panel 2 Deployment Guide

## 1. What to Deploy
`admin_panel2` is a Next.js app that contains:
- Frontend pages (`app/...`)
- Backend API routes (`app/api/...`)

Deploy it as a single service.

## 2. Recommended Hosting
Use **Vercel** for fastest setup and native Next.js support.

## 3. Prerequisites
- GitHub repository containing this project
- Vercel account
- Firebase service-account credentials

## 4. Environment Variables
Set these in Vercel Project Settings -> Environment Variables:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_BACKEND_URL` (optional)
- `NEXT_PUBLIC_API_V1_URL` (optional)

Notes:
- Keep `FIREBASE_PRIVATE_KEY` quoted or escaped (`\n`) as shown in `.env.example`.
- Do not commit real credentials.

## 5. Vercel Setup (Monorepo Path)
If your GitHub repo includes multiple folders (like `gatepass`, `backend`, etc.):

1. Import repository into Vercel.
2. In project settings, set **Root Directory** to:
   - `gatepass/admin_panel2`
3. Build settings:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output: default (Next.js)

## 6. Deploy
After env variables are added:
1. Trigger Deploy (or push to your main branch).
2. Open deployment URL.
3. Test:
   - Login page
   - User listing APIs (`/api/users`)
   - Bulk CSV import flow in user dashboards

## 7. Optional Custom Domain
In Vercel:
1. Go to Project -> Domains.
2. Add your domain.
3. Update DNS records as prompted.

## 8. Troubleshooting
- `Firebase Admin Environment Variables Missing`:
  - One or more Firebase env vars are not set.
- `Failed to fetch users`:
  - Check auth/session cookies and Firebase connectivity.
- CSV import partial failures:
  - Check row-level errors returned from `/api/users/bulk`.

