# Spendly

Spendly is a **portfolio-grade personal expense tracker** with a SaaS-style UI. Track income and expenses, filter and analyze activity, export backups, and choose how you store data:

- **Guest mode** — start immediately; data stays in the browser (`localStorage`).
- **Authenticated mode** — email/password via **Firebase Authentication** with transactions synced to **Cloud Firestore** under your user ID.

No custom backend server is required beyond Firebase.

## Features

- **Landing / entry**: product intro, **Continue as guest**, **Sign in**, **Sign up** (when Firebase is configured).
- **Guest experience**: gentle upgrade prompts; guest data migrates into Firestore when you create an account while data exists locally.
- **Dashboard**: totals, balance, recent activity, category pie chart, monthly bar chart, welcome / sample data.
- **Transactions**: CRUD with `react-hook-form` + Zod, filters, search, sort, CSV export of filtered rows.
- **Analytics**: insights, trends, rankings.
- **Settings**: CSV + JSON export, JSON import (backup or raw array, merge/replace), demo data, reset, account summary, sign out.
- **UX**: responsive shell (sidebar + mobile drawer), dark/light theme, confirmations, toasts, empty states, loading and error states for Firestore.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn-style UI (Radix primitives + CVA)
- Firebase **Auth** (email/password) + **Firestore**
- `lucide-react`, `recharts`, `react-hook-form`, `zod`, `date-fns`, `sonner`, `next-themes`, `clsx`, `tailwind-merge`

## Environment variables

Copy `.env.example` to `.env` locally (and configure the same keys in Vercel → Project → Settings → Environment Variables).

| Variable | Description |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain (`project.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | GCP / Firebase project id |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket (required for config shape) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender id |
| `VITE_FIREBASE_APP_ID` | Web app id |

If these are **missing**, Spendly still runs in **guest-only** mode (sign-in / sign-up buttons are hidden or disabled with guidance).

## Firebase setup

1. In the [Firebase console](https://console.firebase.google.com/), create a project (or use an existing one).
2. Add a **Web app** and copy the config into `.env` as `VITE_FIREBASE_*` values.
3. Enable **Authentication → Sign-in method → Email/Password**.
4. Enable **Firestore** (production mode is fine once rules are deployed).
5. Deploy **Security rules** so each user only reads/writes their own transactions. This repo includes `firestore.rules`:

   ```txt
   users/{userId}/transactions/{transactionId}
   ```

   Example rules (also in `firestore.rules`):

   ```txt
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/transactions/{transactionId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

   Deploy with Firebase CLI:

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore
   firebase deploy --only firestore:rules
   ```

6. **Indexes**: the client queries `users/{uid}/transactions` ordered by `createdAt` descending. Firestore usually prompts in the console to create the composite index if needed; click the link from an error in the browser devtools if it appears.

## Data storage

| Mode | Storage |
| --- | --- |
| Guest | `spendly-guest-transactions-v1` in `localStorage`, plus `spendly-session=guest` |
| Signed in | Firestore collection `users/{uid}/transactions/{transactionId}` with fields matching the in-app `Transaction` model (`id`, `title`, `amount`, `type`, `category`, `date`, `note?`, `createdAt`, plus `userId` / metadata on write) |

Legacy guest data in `spendly-transactions-v1` is **migrated once** into the guest key when first loaded.

## Local development

```bash
npm install
cp .env.example .env   # then fill Firebase keys (optional for guest-only dev)
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push the repository to GitHub.
2. Vercel → **Import Project** → select the repo.
3. Framework: **Vite**. Build: `npm run build`. Output: `dist`.
4. Add the same `VITE_FIREBASE_*` environment variables for **Production** (and Preview if you use previews).
5. `vercel.json` includes SPA rewrites for client-side routing.

## Project structure (high level)

- `src/services/firebase` — Firebase app init + Firestore transaction helpers
- `src/context` — `AuthProvider` / `useAuth`
- `src/store` — `TransactionsProvider` / `useTransactions` (guest vs cloud)
- `src/pages` — landing, auth, dashboard, transactions, analytics, settings
- `src/components` — layout, dashboard, transactions, shared, `ui`
- `src/lib` — schemas, guest storage helpers, formatting
- `src/hooks` — local guest transactions + summaries

## Scripts

- `npm run dev` — dev server
- `npm run build` — typecheck + production bundle
- `npm run preview` — preview production build
- `npm run lint` — ESLint

## Suggested commit strategy

1. `chore: scaffold vite react ts tailwind`
2. `feat(ui): layout, theme, primitives`
3. `feat(auth): firebase auth + guest session`
4. `feat(data): firestore + guest transaction providers`
5. `feat(transactions): crud, filters, export`
6. `feat(insights): dashboard + analytics`
7. `docs: readme, env example, firestore rules`

## Push to GitHub

```bash
git init
git add .
git commit -m "feat: Spendly expense tracker with Firebase"
git branch -M main
git remote add origin https://github.com/<your-username>/spendly.git
git push -u origin main
```

## License

Private / portfolio usage unless you choose otherwise.
