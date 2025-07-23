# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Express.js + TypeScript)
- `cd backend && npm run dev` - Start backend development server with nodemon
- `cd backend && npm run start` - Start production backend server
- `cd backend && npx prisma migrate dev` - Run database migrations
- `cd backend && npx prisma generate` - Generate Prisma client
- `cd backend && npx prisma studio` - Open Prisma Studio for database management

### Frontend (Next.js + TypeScript)
- `cd frontend && npm run dev` - Start frontend development server
- `cd frontend && npm run build` - Build production frontend
- `cd frontend && npm run start` - Start production frontend server
- `cd frontend && npm run lint` - Run ESLint

### Full Stack Development
- Backend runs on port 4000 (http://localhost:4000)
- Frontend runs on port 3000 (http://localhost:3000)
- CORS is configured to allow frontend to communicate with backend

## Architecture Overview

This is a SaaS Pipeline Provisioning Platform that helps users create CI/CD pipelines for their GitHub repositories.

### Core Components

**Backend (Express.js + Prisma + PostgreSQL)**
- API routes in `backend/src/routes/` handle pipeline operations
- `PipelineService` (`backend/src/services/pipelineService.ts`) - Core business logic for pipeline provisioning
- `GitHubAppService` (`backend/src/services/githubAppService.ts`) - GitHub App integration for repository access
- Database models: Pipeline and Waitlist stored in PostgreSQL via Prisma

**Frontend (Next.js + Clerk + Tailwind)**
- Dashboard-based UI with Clerk authentication
- Components in `frontend/src/components/` including landing page sections and dashboard UI
- API routes in `frontend/src/app/api/` for GitHub integration and pipeline management

### Key Features

1. **Pipeline Provisioning**: Supports multiple project types (Node.js, Docker, Unity, Python, Java, Go, Rust, Web, Unreal)
2. **GitHub Integration**: Uses GitHub App for repository access and workflow file creation
3. **Multi-Project Support**: Each project type has specialized workflow generation
4. **Authentication**: Clerk-based user authentication system
5. **Dashboard**: Pipeline management and monitoring interface

### Data Flow

1. User authenticates via Clerk
2. User selects GitHub repository and project type
3. `PipelineService.provisionPipeline()` validates config and generates appropriate GitHub Actions workflow
4. Workflow is committed to repository via GitHub App
5. Pipeline status tracked in PostgreSQL database

### Important Files

- `backend/src/services/pipelineService.ts` - Main pipeline logic with workflow generators for each project type
- `backend/prisma/schema.prisma` - Database schema
- `frontend/src/app/dashboard/` - Main dashboard pages
- `frontend/src/components/` - Reusable UI components

### Environment Setup

Backend requires these environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_APP_ID` - GitHub App ID
- `GITHUB_APP_PRIVATE_KEY` - GitHub App private key
- `PORT` - Backend port (defaults to 4000)

Frontend uses Clerk for authentication and requires appropriate Clerk environment variables.

## Database

Uses PostgreSQL with Prisma ORM. Main models:
- `Pipeline` - Stores pipeline configurations and status
- `Waitlist` - Stores user waitlist entries

Run migrations after schema changes and regenerate Prisma client when updating database schema.