# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server at http://localhost:5173
- `npm run dev -- --open` - Start dev server and open browser
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Start production server (requires build first)

### Code Quality
- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Auto-format code with Prettier

### Database Setup
- `sqlite3 data/db.sqlite3 < scripts/schema.sql` - Initialize database with schema
- Database file: `./data/db.sqlite3` (SQLite with WAL mode)

## Architecture

### Technology Stack
- **Framework**: SvelteKit with adapter-node for deployment to Fly.io
- **Database**: SQLite with better-sqlite3 driver
- **Styling**: TailwindCSS with forms and typography plugins
- **Rich Text**: ProseMirror for in-place editing
- **Email**: Nodemailer for sharing posts with friends
- **Build**: Vite with Svelte preprocessor

### Core Concept
PostOwl is a personal publishing platform with three post types:
- **Public posts**: Blog-style posts visible to everyone
- **Shared posts**: Secret links sent to selected friends via email
- **Private posts**: Personal journal entries

Key feature is "in-place editing" - content can be edited directly on the rendered page.

### Database Schema
- `posts` - Core content with slug-based routing
- `friends` - Email contacts for sharing posts
- `recipients` - Many-to-many relationship tracking post shares with secret access tokens
- `sessions` - Authentication sessions (password-based, single admin user)
- `pages` - Editable website content (bio, etc.)
- `counters` - Anonymous view tracking
- `assets` - Binary file storage with MIME types

### Application Structure

#### Authentication & Authorization
- Single admin user system using environment variables (`ADMIN_PASSWORD`, `ADMIN_NAME`)
- Session-based auth with cookies, handled in `hooks.server.js`
- All write operations require `currentUser` check

#### Routing Pattern
- `/` - Homepage with public posts and bio
- `/posts/[slug]` - Individual post view with optional secret access
- `/posts/new` - Post creation/editing
- `/friends/` - Friend management
- `/login` & `/logout` - Authentication
- `/api/*` - Server endpoints for CRUD operations

#### Key Libraries
- **ProseMirror**: Rich text editing with custom schema and plugins
- **Slugify**: URL-safe slugs with collision handling via nanoid
- **Better-sqlite3**: Synchronous SQLite operations with transactions
- **Nodemailer**: SMTP email sending for post sharing

#### File Organization
- `src/lib/api.js` - Core database operations and business logic
- `src/lib/components/` - Reusable Svelte components
- `src/lib/prosemirror*` - Rich text editor configuration
- `src/routes/api/` - Server-side endpoints
- `static/` - Public assets (images, etc.)

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `DB_PATH` - SQLite database location
- `ADMIN_PASSWORD` & `ADMIN_NAME` - Admin credentials
- SMTP settings for email functionality (use mailpit for local dev)

### Commit Message Format
Follow conventional commits: `type(scope): subject`
- Types: feat, fix, docs, style, refactor, test, chore
- Keep subject under 50 characters, imperative mood
- Example: `fix(config): handle comments in environment variables`

### Development Notes
- No TypeScript (intentionally JavaScript-first project)
- No formal test suite (early development phase)
- Optimized for single-user deployment
- Uses SQLite WAL mode for better concurrency
- Email functionality requires SMTP configuration