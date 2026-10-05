# ArtShare 2.0 Foundation

A clean HTML/CSS/JavaScript foundation for rebuilding ArtShare.

## Stack
- HTML
- CSS
- JavaScript ES modules
- Firebase Authentication
- Cloud Firestore
- Firebase Storage

No framework is required.

## Setup

1. Create a Firebase project.
2. Enable Email/Password Authentication.
3. Create a Firestore database.
4. Enable Firebase Storage.
5. Register a Web App in Firebase.
6. Copy the web app config into `js/firebase.js`.
7. Deploy `firestore.rules` and `storage.rules`.
8. Serve the folder through a local/static web server. Do not open the HTML files directly with `file://`.

## Current foundation

- Email/password signup
- Email/password login
- Logout
- User profiles
- Artwork upload
- Firebase Storage image hosting
- Firestore artwork posts
- Home feed
- Explore page foundation
- Profile artwork grid
- Individual post page
- Tags stored with posts
- Responsive layout
- Centralized Firebase initialization
- Basic security rules

## Important

The rules are a foundation, not the final production moderation/security model. Before public launch we should add validation for post fields, rate limiting/abuse controls, reports, moderation, comment validation, follows, notifications, and stronger Storage validation.
