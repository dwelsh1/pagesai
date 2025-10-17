# PagesAI Project Plan (Phase 1)

See conversation for full detail; this document summarizes goals, scope, acceptance criteria.
- Auth: JWT cookie via `jose`, `bcryptjs` (seeded user).
- UI: Header (Pages, theme toggle, +), Sidebar (search, favorites, all pages, resize, drag-drop), Editor (BlockNote).
- Data: SQLite + Prisma; Page has parent/child support, sortIndex, contentJson.
- API: /api/auth/login|logout, /api/pages, /api/pages/:id, /api/pages/reorder, /api/search.
- Tests: Vitest ≥90% coverage, Playwright major flows, visual snapshots available from the starter.
