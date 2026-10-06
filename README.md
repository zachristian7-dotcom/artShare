# ArtShare — Cloudinary build

## Stack
- HTML/CSS/JavaScript only
- Render static hosting
- Firebase Authentication
- Cloud Firestore
- Cloudinary direct unsigned image uploads

## Firebase
The supplied Web App config is in `js/firebase.js`.

In Firebase:
1. Enable Authentication → Email/Password.
2. Create Firestore.
3. Publish `firestore.rules`.
4. Add your Render hostname under Authentication → Settings → Authorized domains.

Firebase Storage is not used.

## Cloudinary
Configured values:
- Cloud name: `druqg4ncx`
- Upload preset: `artshare_uploads`

The preset must be unsigned. Recommended restrictions: JPG/JPEG/PNG/WebP and a sensible file-size limit.

Never put a Cloudinary API Secret in browser JavaScript.

## Render
Static Site:
- Branch: `main`
- Root Directory: blank
- Build Command: blank
- Publish Directory: `.`
- Auto Deploy: Yes

### Render environment variables
**None are required for the current frontend-only architecture.**

Firebase Web config and Cloudinary cloud name/unsigned preset are client-side configuration. A future backend would keep `CLOUDINARY_API_SECRET` in server environment variables.

## Local testing
Use a local HTTP server instead of opening HTML directly:
`python3 -m http.server 8000`
Then open `http://localhost:8000`.

## Important
If Firebase still reports `auth/api-key-not-valid`, verify the Web App config in Firebase Project Settings → General → Your apps and make sure the API key belongs to project `artshare07`.
