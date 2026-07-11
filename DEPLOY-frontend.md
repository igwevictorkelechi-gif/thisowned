# Frontend Deployment Guide (Storefront)

This branch (`frontend`) is the customer-facing **Next.js 14** storefront. It is a
separate app from the Django backend (which lives on the `backend` branch and is
deployed as its own Vercel project). The storefront talks to the backend REST API
entirely through `NEXT_PUBLIC_*` environment variables.

- App: Next.js 14 (App Router) · React 18 · Tailwind · axios
- Payments: Flutterwave + Paystack (client-side, publishable keys)
- Backend API base: `https://thisowned-beta.vercel.app` (endpoints under `/api/`)

---

## 1. Import the project in Vercel (one-time)

1. Vercel dashboard -> **Add New... -> Project**.
2. Select the **`igwevictorkelechi-gif/thisowned`** repo -> **Import**.
3. **Framework Preset:** Next.js (auto-detected). **Root Directory:** repo root.
   Leave Build/Output commands at their defaults.
4. **Set the Production Branch to `frontend`** (Git section during import, or later
   under Settings -> Git -> Production Branch). The repo default is `backend`, which
   is the *wrong* app for this project.
5. Use a distinct project name, e.g. **`thisowned-storefront`**, so it does not
   collide with the existing `thisowned` (backend) project.

---

## 2. Environment variables

Add these 12 variables (Production, and Preview if you want PR previews). They are
read at build time. Use the same values as the existing `.env.local`.

| Variable | Value / endpoint |
|---|---|
| `NEXT_PUBLIC_PRODUCTS_URL` | `https://thisowned-beta.vercel.app/api/products/` |
| `NEXT_PUBLIC_COLLECTION_URL` | `https://thisowned-beta.vercel.app/api/collection/all/` |
| `NEXT_PUBLIC_USERS_URL` | `https://thisowned-beta.vercel.app/api/users/` |
| `NEXT_PUBLIC_CART_URL` | `https://thisowned-beta.vercel.app/api/cart/` |
| `NEXT_PUBLIC_CHECKOUT_URL` | `https://thisowned-beta.vercel.app/api/checkout/` |
| `NEXT_PUBLIC_ORDERS_URL` | `https://thisowned-beta.vercel.app/api/order/` |
| `NEXT_PUBLIC_AUTH_TOKEN_URL` | `https://thisowned-beta.vercel.app/api/token/` |
| `NEXT_PUBLIC_AUTH_REGISTER_URL` | `https://thisowned-beta.vercel.app/api/register/` |
| `NEXT_PUBLIC_AUTH_SHIPPING_URL` | `https://thisowned-beta.vercel.app/api/shipping_rate/` |
| `NEXT_PUBLIC_WAITLIST_URL` | `https://thisowned-beta.vercel.app/api/waitlist/` |
| `NEXT_PUBLIC_FLUTTERWAVE_LIVE_KEY` | Flutterwave publishable key |
| `NEXT_PUBLIC_PAYSTACK_TEST_KEY` | Paystack publishable key |

> Trailing slashes matter: the app builds URLs like `${PRODUCTS_URL}${id}/` and
> `${CART_URL}${itemId}/`, so the base values must end in `/` exactly as above.

The backend allows all origins (`CORS_ALLOW_ALL_ORIGINS = True`), so no backend
change is needed for the new storefront domain.

---

## 3. Deploy and verify

1. Click **Deploy**. Next.js builds from the `frontend` branch. After the initial
   import, every push to `frontend` auto-deploys.
2. Verify once live:
   - Homepage loads products (confirms `PRODUCTS_URL`).
   - Shop -> product -> add to cart works (confirms `CART_URL`).
   - Checkout loads shipping rates (confirms `AUTH_SHIPPING_URL` + `CHECKOUT_URL`).

---

## 4. Local development

```bash
npm install
cp .env.example .env.local   # or create .env.local with the vars from section 2
npm run dev                  # http://localhost:3000
```

---

## 5. Notes

- `next.config.mjs` whitelists the Supabase domain
  (`depojvulqfgrxvinsdgn.supabase.co`) for `next/image`, since product images are
  served from Supabase storage.
- Payment keys here are **publishable** (`NEXT_PUBLIC_`) keys, safe to expose in the
  browser bundle. Do **not** put secret/live server keys in `NEXT_PUBLIC_*` vars.
