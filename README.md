# Campus Placement Portal

Full stack CRUD application built with React, TypeScript, Express, MySQL, JWT, and Tailwind CSS.

## Features

- Student, recruiter, and admin roles
- Register, login, logout, JWT authentication
- Student profile editing and job applications
- Recruiter company/job management and applicant viewing
- Admin user and job management
- Normalized MySQL schema with seed data
- Consistent API responses and role-based authorization

## Tech Stack

Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, React Router  
Backend: Node.js, Express.js, TypeScript, MySQL, mysql2, JWT, bcrypt, dotenv, cors

## Getting Started

Use Node.js `20` or newer. The project uses modern Vite and React Router packages that do not support old Node versions.

### 1. Create the database

```bash
mysql -u root -p < backend/src/database/schema.sql
mysql -u root -p < backend/src/database/seed.sql
```

Seeded accounts use the password `Password@123`:

- `student@example.com`
- `recruiter@example.com`
- `admin@example.com`

### 2. Start the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Update `.env` with your MySQL credentials before starting.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Project Structure

```text
backend/src
  config        Environment and database config
  controllers   Request/response handlers
  services      Business logic and SQL queries
  routes        API route declarations
  middleware    Auth, role, validation, and error middleware
  database      MySQL schema and seed data
  utils         JWT, password, response helpers

frontend/src
  pages         Route-level screens
  components    Reusable UI components
  services      Axios API functions
  context       Authentication context
  hooks         Shared hooks
  utils         Shared TypeScript types
```

## Documentation

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Database Design](docs/DATABASE_DESIGN.md)
- [API Specification](docs/API_SPECIFICATION.md)
