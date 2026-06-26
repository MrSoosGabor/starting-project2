# Repository Guidelines

## General Instructions

- ALWAYS run `bun run lint` after making any changes
- ALWAYS check for type errors via `bun tsc --noEmit`
- ALWAYS run `bun run format` AFTER you're done with your task and you edited all files that needed

## Project Structure & Module Organization

This is a Bun-powered Next.js App Router project for TinyNotes. Application routes live under `app/`. The root shell is defined in `app/layout.tsx`, the root page in `app/page.tsx`, and global styles in `app/globals.css`.

Route groups organize the current placeholder pages:

- `app/(public)/` contains public pages such as `/login`, `/register`, and `/s/[token]`.
- `app/(notes)/notes/` contains authenticated-note route placeholders such as `/notes`, `/notes/new`, and `/notes/[id]`.
- `app/not-found.tsx` defines the custom 404 page.

Project requirements are documented in `SPEC.MD`. Configuration files are at the repository root, including `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and `postcss.config.mjs`.

## Build, Test, and Development Commands

- `bun install` installs dependencies from `bun.lock`.
- `bun run dev` starts the local Next.js development server.
- `bun run build` creates a production build.
- `bun run start` serves the production build after `bun run build`.
- `bun run lint` runs `oxlint`.
- `bun run format` runs `oxfmt`.

There is no test command yet. Add one when a test framework is introduced.

## Coding Style & Naming Conventions

Use TypeScript and React server components by default. Add `"use client"` only when interactivity or browser APIs are required. Keep route files named according to App Router conventions: `page.tsx`, `layout.tsx`, and `not-found.tsx`.

Prefer concise components, clear prop names, and TailwindCSS utility classes for styling. Use ASCII text unless a file already requires Hungarian accents or other Unicode content. Run `bun run lint` before submitting changes.

## Commit & Pull Request Guidelines

The existing history uses short, descriptive commit messages, for example `Alap oldalak létrehozása`. Continue using concise imperative or summary-style messages that describe the completed change.

Pull requests should include:

- A short description of the change.
- Any relevant issue or task reference.
- Screenshots for visible UI changes.
- Notes about verification, such as `bun run lint` or `bun run build`.

## Security & Configuration Tips

Do not commit secrets or local database files. Future environment variables should follow `SPEC.MD`, including `AUTH_SECRET`, `APP_URL`, and `DB_PATH`. Keep auth, database, and share-token logic out of placeholder pages until those layers are intentionally implemented.
