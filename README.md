# Connvei API

The backend for **Connvei**, a blogging platform. Originally written in plain
JavaScript, now rewritten in **TypeScript** following the architecture - controllers → handlers, services, models, routes,
middlewares, config, custom response/exception handlers.

Every route is served under `/api`.

## Tech

- Node `>=18`, Express, TypeScript (strict)
- MongoDB via Mongoose 8
- JWT auth (`Authorization: Bearer <token>`, HS256)
- Zod request validation
- Multer (persistent storage) for image uploads — photos are stored in Cloudinary
- Nodemailer (Gmail OAuth2) for transactional email

## Project structure

```
src/
  app.ts                 # express app, middleware, error handler
  server.ts              # entry point (boots app + db)
  config/                # db, email, jwt cookie, multer uploader
  controllers/           # one folder per resource (auth/user/blog have handlers)
  services/              # email.service.ts
  models/                # *.model.ts (mongoose + InferSchemaType)
  schema/                # zod validation schemas
  middlewares/           # auth, validate, logger
  helpers/               # mongo error translate, blog helpers, misc
  interfaces/            # shared TS interfaces
  utils/handlers/        # CustomResponse + CustomException
  routes/                # *.route.ts + index.ts barrel
```

All JSON responses use the standard envelope:

```json
{ "success": true, "code": 200, "message": "", "data": {}, "meta": {} }
```

## Running locally

```bash
npm install     # installs deps AND compiles to dist/ (postinstall)
npm run dev     # nodemon + ts-node on src/server.ts
```

Copy `.env.sample` to `.env` and fill it in first.

## Build

```bash
npm run build   # tsc -> dist/
npm start       # node dist/server.js
```

## Deployment (Render)

No hosting config change is required from the original setup:

- **Build command:** `npm install` — this runs the `postinstall` hook which
  compiles TypeScript to `dist/`. `typescript` and the `@types/*` packages live
  in `dependencies` (not `devDependencies`) precisely so the build still works
  when Render installs with `NODE_ENV=production` (which skips dev deps).
- **Start command:** `npm start` (which runs `node dist/server.js`). If your
  Render service was set to the old literal `node server.js`, change that one
  field to `npm start`.

### Environment variables

Set the same variables you already had (see `.env.sample`). `NODE_ENV=production`
selects `DATABASE_CLOUD` over `DATABASE`, exactly as before.

## Notes on the rewrite

- **Passwords** keep the original HMAC-SHA1 + per-user salt scheme, so existing
  accounts continue to authenticate unchanged.
- **Routes and their paths are identical** to the original API (`/api/signin`,
  `/api/blog`, `/api/blogs-categories-tags`, `/api/user/photo/:username`, …).
- **Response bodies now use the `CustomResponse` envelope** shown above — the
  frontend needs to read `res.data` instead of the raw body.
- Uploads moved from `formidable` to `multer` (persistent storage); then uploaded to
  Cloudinary and the returned url is saved as (`photo: url `).
- Email verification / password reset stay JWT-based (no Redis/session store).
