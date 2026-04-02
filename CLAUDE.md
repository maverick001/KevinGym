# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Install dependencies
```bash
npm run install-all        # Install all (root + backend + frontend)
cd backend && npm install  # Backend only
cd frontend && npm install # Frontend only
```

### Development
```bash
npm run dev               # Run both backend (nodemon) and frontend concurrently
cd backend && npm run dev # Backend only (nodemon, port 6001)
cd frontend && npm start  # Frontend only (port 3000)
```

### Testing
```bash
npm test                  # Run backend tests (mocha/chai)
cd backend && npm test    # Backend tests only
cd frontend && npm test   # Frontend tests (Jest/React Testing Library)
```

### Production
```bash
npm start                 # Run both in production mode
cd frontend && npm run build  # Build frontend for production
```

## Architecture

MERN stack: MongoDB + Express (backend, port 6001) + React (frontend, port 3000).

### Backend (`backend/`)
- `server.js` — Express entry point; mounts routes at `/api/auth` and `/api/tasks`
- `config/db.js` — Mongoose connection (URI from `MONGO_URI` env var)
- `routes/authRoutes.js` — Auth endpoint definitions
- `controllers/authController.js` — Business logic for register, login, profile CRUD
- `middleware/authMiddleware.js` — JWT `protect` middleware; attaches `req.user` from Bearer token
- `models/User.js` — Mongoose schema with auto-hashing bcrypt pre-save hook

**Note**: Task routes are defined in the frontend but not yet implemented in the backend (commented out in `server.js`).

### Frontend (`frontend/src/`)
- `axiosConfig.jsx` — Axios instance with `baseURL: http://localhost:6001` and Bearer token injection from AuthContext
- `context/AuthContext.js` — React Context for user/token state; persists token across components
- `App.js` — React Router routes; wraps protected routes
- `pages/` — Login, Register, Profile, Tasks
- `components/` — Navbar, TaskForm, TaskList

### Authentication Flow
1. Register/Login → backend returns JWT (30-day expiry) + user data
2. Token stored in `AuthContext`; injected into every Axios request via `Authorization: Bearer <token>`
3. Protected backend routes use `protect` middleware to verify JWT and attach user to `req.user`

### Environment Variables
Backend requires a `.env` file (see `.env.example` if present):
```
MONGO_URI=<MongoDB connection string>
JWT_SECRET=<secret key>
PORT=6001
```

### CI/CD
GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`: installs dependencies and runs backend tests with Node.js 14.
