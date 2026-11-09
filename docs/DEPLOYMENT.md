# Running and deploying Campus

## Local development

Requirements: Java 21+ compatible with Spring Boot 4.1, MySQL 8, Node.js 20+, and internet access for the first Maven/npm dependency downloads.

Create an empty database called `campus_placement_portal` and a database user with access to it. Configure `backend/.env` from `backend/.env.example`, then run:

```bash
cd backend
./mvnw spring-boot:run
```

Flyway creates missing tables and applies schema migrations. With an existing project schema it records baseline version 0, runs the idempotent V1 migration, and then subsequent changes. Back up existing databases before any schema change. This baseline policy assumes the existing database is this project’s schema; it does not reconcile arbitrary schema drift.

For a disposable demo database only, you can instead import `src/main/resources/database/schema.sql` followed by `seed.sql`. **The schema import drops existing tables. Never use it against production data.** Seeds create student/recruiter/admin demo accounts sharing `Password@123`; production never imports them automatically.

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. The default API port is 5000. If macOS or another service occupies that port, change `PORT` in `backend/.env`, and set `VITE_API_URL=http://localhost:YOUR_PORT/api` when starting Vite.

### Local Docker demo

```bash
docker compose up --build
```

Open `http://localhost`. This configuration deliberately imports demo data only on a fresh MySQL volume. An existing volume is reused; initialization scripts will not run again. Do not delete a volume containing data you need.

## Production configuration

`compose.production.yml` is separate from the local demo configuration. It:

- Imports no seed accounts and mounts no destructive SQL.
- Requires database passwords, a JWT secret, and the frontend origin.
- Uses a dedicated `campus` database account instead of root for application queries.
- Keeps MySQL and Spring Boot off host ports.
- Publishes the frontend only on host `127.0.0.1:8080`, for an HTTPS reverse proxy on the same host.
- Uses backend health/readiness checks, a non-root Java runtime, a read-only backend filesystem, and a temporary writable `/tmp`.

On the deployment host:

```bash
cp .env.production.example .env.production
# Edit .env.production. Use distinct random DB passwords and a random JWT secret.
docker compose --env-file .env.production -f compose.production.yml up --build -d
```

The example file contains placeholders only. Generate a JWT secret using a password manager or `openssl rand -hex 32`. Keep the populated environment file private and out of Git. Set `FRONTEND_URL` to your exact public HTTPS origin (without a trailing slash).

Configure your host’s HTTPS reverse proxy to forward that origin to `http://127.0.0.1:8080`. Nginx in the frontend container forwards `/api` to Spring Boot internally. Configure certificates, renewal, HSTS at the HTTPS edge, trusted proxy/client-IP rules, and any external firewall for your hosting environment. TLS is not automatically provisioned by this repository.

The app’s database account needs schema permissions for startup migrations. For stricter environments, run migrations under a separate deployment identity and grant the runtime user only required data permissions.

### Provision the first administrator

Provision an admin only against a fresh deployment without an existing admin. Do not import demo seeds to create a production administrator.

Set `BOOTSTRAP_ADMIN_EMAIL` and `BOOTSTRAP_ADMIN_PASSWORD` in your current shell, using a secure prompt or your secret manager. Use a unique password of at least 12 characters, within 72 UTF-8 bytes. Do not put the actual password in a committed file or command history.

Then run a temporary backend container:

```bash
docker compose --env-file .env.production -f compose.production.yml run --rm \
  -e SPRING_PROFILES_ACTIVE=prod,bootstrap-admin \
  -e BOOTSTRAP_ADMIN_EMAIL -e BOOTSTRAP_ADMIN_PASSWORD backend
```

Wait for the “Initial administrator created” log, then stop the temporary process with Ctrl+C. The regular backend container remains running. Unset the bootstrap credentials in your shell and sign in through the website. The bootstrap is opt-in, stores only a BCrypt hash, and refuses to create another administrator if one already exists. Do not leave the bootstrap profile enabled on regular application containers.

### Verify after deployment

```bash
docker compose --env-file .env.production -f compose.production.yml ps
docker compose --env-file .env.production -f compose.production.yml logs --tail=100 backend
```

The backend container checks `/actuator/health/readiness`, which includes database availability. Detailed health output is suppressed. Only the health actuator endpoint is exposed by Spring Security; other management endpoints are not public.

From a browser, verify login, student profile saving, recruiter job creation, application submission, recruiter status updates, and admin controls. Test backup/restore and migrations on a staging MySQL instance before introducing real users.

## Automated verification

```bash
cd backend
./mvnw clean verify
```

Backend tests use isolated H2 databases in MySQL compatibility mode. They cover API behavior, authorization, ownership, deleted-account tokens, validation, migration creation, and data integrity. They do not replace verification against real MySQL.

```bash
cd frontend
npm ci
npm run build
```

GitHub Actions runs these builds on pushes to `main` and pull requests. It does not deploy infrastructure or provide production secrets.

## Operational limits

The UI has responsive layouts, keyboard focus styles, labeled inputs, native confirmation dialogs, reduced-motion support, and visible error states. Browser accessibility scans are useful checks, not a complete accessibility audit.

Authentication uses bearer JWTs in browser session storage. Logout is local; there is no token denylist, refresh-token service, password reset, email verification, or MFA. Recruiter identity is not verified. Nginx applies an IP-based login/signup limit; direct backend traffic and distributed deployments need additional controls.

Nginx uses a same-origin content security policy. If you intentionally point a production build at an external API, update the policy to allow that exact origin; avoid wildcards. Do not expose the backend directly merely to bypass Nginx’s policy or rate limits.

Review your privacy obligations, access policy, data retention, account recovery, abuse handling, monitoring, load requirements, dependency updates, backups, and restore process before launch.
