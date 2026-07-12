# Deployment & Configuration Guide

This project is a Django backend (REST API + server-rendered dashboard) deployed
to **Vercel** and backed by a **Neon PostgreSQL** database and **Supabase**
storage for media files.

- Production branch: **`backend`** (Vercel auto-deploys pushes to this branch)
- Live URLs:
  - https://thisowned-beta.vercel.app
  - https://thisowned-igwevictorkelechi-gifs-projects.vercel.app
- Dashboard login: `/login/` — Django admin: `/admin/` — REST API: `/api/`

---

## 1. Environment variables

All secrets are read from the environment (see `website/settings.py`). Locally
they load from a `.env` file via `python-dotenv`; in production they come from
the Vercel project's Environment Variables. Copy `.env.example` to `.env` for
local work. **Never commit `.env`** — it is gitignored.

| Variable | Required | Description |
|---|:---:|---|
| `DJANGO_SECRET_KEY` | ✅ | Django secret key. Generate a fresh 50-char random value. |
| `DJANGO_DEBUG` | | `True`/`False`. Defaults to `False`. Keep `False` in production. |
| `DJANGO_ALLOWED_HOSTS` | | Comma-separated host list. Defaults to `*`. |
| `DB_HOST` | ✅ | Neon Postgres host (e.g. `ep-xxxx-pooler.us-east-1.aws.neon.tech`). |
| `DB_NAME` | ✅ | Database name (e.g. `verceldb`). |
| `DB_USER` | ✅ | Database user (e.g. `default`). |
| `DB_PASSWORD` | ✅ | Database password. |
| `DB_PORT` | | Defaults to `5432`. |
| `SUPABASE_URL` | ✅ | Supabase project URL for media storage. |
| `SUPABASE_KEY` | ✅ | Supabase API key. |
| `SUPABASE_BUCKET_NAME` | | Storage bucket. Defaults to `thisowned-eco`. |
| `JWT_SIGNING_KEY` | | Signing key for API JWTs. Defaults to `DJANGO_SECRET_KEY`. |

> If **no** `DB_HOST`/`DB_PASSWORD` are set, the app falls back to a local
> SQLite database (`db.sqlite3`). That is fine for local development but must
> **never** be relied on in production — Vercel's filesystem is ephemeral and
> the data would be lost on every deploy.

---

## 2. Configure Vercel (one-time)

1. Open the `thisowned` project on Vercel → **Settings → Environment Variables**.
2. Add every variable marked ✅ above (and any optional ones you need), scoped to
   **Production** (and Preview if you use preview deployments).
3. Redeploy so the new values take effect.

---

## 3. Deploying

Vercel builds from the `backend` branch automatically:

```bash
git checkout backend
git merge <your-feature-branch>   # or open a PR into backend and merge it
git push origin backend           # triggers a production deploy
```

The build runs `build.sh` (installs `requirements.txt`, runs `collectstatic`).
Django itself is served as a Python serverless function via `website/wsgi.py`
(see `vercel.json`).

### Database migrations

Vercel's build does not run migrations by default. Apply schema changes from a
machine that can reach Neon, with the production DB vars set in your `.env`:

```bash
python manage.py migrate
```

---

## 4. Managing dashboard access

The dashboard requires a Django **staff** user; login is by **email** (custom
user model, no username). Run these locally with the production DB vars in
`.env`:

```bash
# Reset an existing user's password
python manage.py changepassword admin@gmail.com

# Create a new superuser
python manage.py createsuperuser
```

---

## 5. Local development

```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # leave DB vars blank to use local SQLite
python manage.py migrate
python manage.py runserver
```

---

## 6. Security checklist

- [ ] All secrets live in env vars / Vercel, never in committed code.
- [ ] `DJANGO_DEBUG=False` in production.
- [ ] Neon DB password, Supabase key, and `DJANGO_SECRET_KEY` have been rotated
      since any previously committed values are considered compromised.
- [ ] `.env` is gitignored and not tracked.
