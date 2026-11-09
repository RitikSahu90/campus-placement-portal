# Campus Placement Portal

Campus recruitment application with a React frontend and a Java Spring Boot backend.

## Features

- Student, recruiter, and admin roles with JWT authentication
- Student academic profiles, resume URLs, job browsing, and applications
- Recruiter company/job management and applicant lists
- Admin user/job management
- MySQL schema, demo data, ownership checks, duplicate-application protection

## Stack

Frontend: React 18, TypeScript, Vite, Tailwind CSS, Axios, React Router.
Backend: Java 21, Spring Boot 4.1, Spring Web MVC, Spring Security, OAuth2 JWT resource server, Bean Validation, Spring JDBC, MySQL, BCrypt.

## Local setup

Install JDK 21 (or a compatible newer JDK), and Node.js 20+ for the frontend. The Maven wrapper downloads Maven on its first run.

### Database

```bash
mysql -u root -p < backend/src/main/resources/database/schema.sql
mysql -u root -p < backend/src/main/resources/database/seed.sql
```

Database: `campus_placement_portal`. **The schema script drops and recreates project tables; use it only for a fresh/disposable database.** Existing databases with the same schema can be reused without running these scripts.

Demo accounts: `student@example.com`, `recruiter@example.com`, `admin@example.com`; password: `Password@123`.

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and a JWT_SECRET of at least 32 UTF-8 bytes.
./mvnw spring-boot:run
```

On Windows use `mvnw.cmd`. The backend reads `.env` as Java properties from its working directory. Environment variables override file values. `JWT_TTL` is an ISO-8601 duration; the default is `PT1H` (one hour). API: `http://localhost:5000/api`; health: `/api/health`.

```bash
cd backend
./mvnw clean verify
java -jar target/placement-portal-1.0.0.jar
```

Tests run against isolated H2 databases in MySQL compatibility mode. Production uses MySQL; tests do not modify your MySQL data.

### Frontend

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. `VITE_API_URL` overrides the default API URL `http://localhost:5000/api`.

## Docker

```bash
docker compose up --build
```

Open `http://localhost`. Nginx proxies `/api` to Spring Boot. MySQL initialization runs only when its data volume is empty. For an existing volume, ensure `campus_placement_portal` exists and set `DB_PASSWORD` to the existing root password. Set `JWT_SECRET`, `DB_PASSWORD`, and (if using another origin) `FRONTEND_URL` through your shell or a root `.env` file. Demo defaults are for local use.

## Structure

```text
backend/
  pom.xml, mvnw, mvnw.cmd     Maven build and wrapper
  src/main/java/com/campusplacement/portal/
    PlacementPortalApplication.java
    PortalController.java    REST endpoints matching the React client
    AuthService.java          Registration, login, BCrypt, JWT issuance
    PortalService.java        Transactional business logic and parameterized SQL
    SecurityConfig.java       Stateless JWT authentication, roles, CORS
    Requests.java             Validated request DTOs
    Api*.java                 Response envelope and error handling
  src/main/resources/
    application.properties
    database/                 MySQL schema and seed scripts
  src/test/                   API integration tests and isolated test schema
frontend/src/
  pages, components, services, context, hooks, utils
```

The Node/Express backend has been removed; Node is used only to build/run the React frontend.

## Demo limitations

Public admin signup is disabled. Use the opt-in bootstrap profile for the first production administrator. Recruiters can update statuses on applications to their own jobs. Resume storage is a URL field and academic eligibility is reviewed by recruiters. Homepage profiles/reviews are clearly labeled placeholders. Logout clears the tab’s session token; stolen copies are not centrally revoked. See the deployment guide for the remaining launch requirements.

## Professional interface and deployment foundation

- Responsive sage/cream design, accessible navigation, labeled forms, and account workspaces
- Search, job filters, result pagination, live saved-profile preview, and application status tracking
- Recruiter-owned jobs and applicant management; admin confirmations and self-deletion protection
- Flyway migrations, database readiness probes, separate production configuration, and CI builds
- Clearly labeled demo profiles and sample reviews; no fabricated endorsements or ratings

For a fresh non-demo installation, create the database and let Flyway create tables at backend startup. Manual schema import above is only for disposable demos. Production does not automatically import demo accounts.

## Documentation

- [How everything works](docs/HOW_IT_WORKS.md)
- [Local setup and production deployment](docs/DEPLOYMENT.md)

- [Project Overview](docs/PROJECT_OVERVIEW.md)
- [Database Design](docs/DATABASE_DESIGN.md)
- [API Specification](docs/API_SPECIFICATION.md)
