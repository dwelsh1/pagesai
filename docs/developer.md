# PagesAI – Developer Guide
## Run
pnpm install
pnpm migrate
pnpm seed
pnpm dev
# open http://localhost:3000
# login: admin@example.com / Passw0rd!

## Scripts
- dev/build/start, migrate/seed, test:watch, test:unit, coverage, fts:setup

## Notes
- JWT cookie (HttpOnly, SameSite=Lax, Secure in prod).
- Prisma + SQLite; pages ordered by sortIndex; drag-drop persists.
- Editor saves contentJson.
