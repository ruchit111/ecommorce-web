# ShopZone deployment

## Frontend on Vercel

1. Open Vercel and choose **Add New > Project**.
2. Import `ruchit111/ecommorce-web` from GitHub.
3. Set **Root Directory** to `frontend`.
4. Keep the framework as **Vite**.
5. Set the environment variable:

```text
VITE_API_URL=https://YOUR-BACKEND-DOMAIN
```

6. Deploy.

The `frontend/vercel.json` rewrite keeps React Router pages working on refresh.

## Environment variables

The Express backend is included as a Vercel serverless API under `/api/*`. Create a MongoDB Atlas database and add these Vercel environment variables for **Production**:

```text
NODE_ENV=production
FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN.vercel.app
USE_MEMORY_DB=false
MONGODB_URI=mongodb+srv://...
JWT_SECRET=use-a-long-random-secret
```

No `VITE_API_URL` is needed when the API is deployed in the same Vercel project. The frontend uses its own `/api` path in production.

Do not use `USE_MEMORY_DB=true` in production because its data disappears whenever the server restarts.
