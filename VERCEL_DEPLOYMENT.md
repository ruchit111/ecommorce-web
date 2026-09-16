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

## Backend requirements

Deploy the `backend` separately on a Node host such as Render, Railway, or another server host. Use a persistent MongoDB Atlas database and set:

```text
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://YOUR-FRONTEND-DOMAIN.vercel.app
USE_MEMORY_DB=false
MONGODB_URI=mongodb+srv://...
JWT_SECRET=use-a-long-random-secret
```

After the backend is deployed, put its HTTPS URL in Vercel as `VITE_API_URL`, then redeploy the frontend.

Do not use `USE_MEMORY_DB=true` in production because its data disappears whenever the server restarts.
