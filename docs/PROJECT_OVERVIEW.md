# Project Overview

Campus Placement Portal is a simple placement management system for students, recruiters, and admins.

The project intentionally avoids heavy abstractions such as Prisma, GraphQL, Next.js, and microservices. It uses explicit SQL through Spring JDBC and transactional Java services so the code is easy to explain in a placement interview.

## Roles

### Student

- Register and login
- Edit academic profile
- Browse jobs
- View job details
- Apply for jobs
- View applied jobs

### Recruiter

- Register and login
- Create or update company details while posting jobs
- Create, edit, and delete jobs
- View applicants for owned jobs

### Admin

- View users
- Delete users
- View jobs
- Delete jobs

## Architecture

The Java 21 / Spring Boot backend uses a controller-service structure:

- `PortalController` maps REST endpoints and validates request DTOs.
- `AuthService` handles BCrypt passwords and JWT issuance.
- `PortalService` contains transactional business logic and parameterized JDBC queries.
- `SecurityConfig` validates JWTs and enforces roles through a stateless Spring Security filter chain.
- `ApiExceptionHandler` produces consistent JSON errors.
- Application responses retain snake_case database fields and camelCase request DTOs for React compatibility.
- Configuration comes from environment variables or an optional backend `.env` properties file.
- Database creation/seeding is explicit; Flyway creates missing tables and applies migrations at startup, without dropping existing project tables.

The frontend uses React Router for pages, an auth context for session state, and Axios service modules for API calls.

## Assumptions

- Resume upload is stored as a URL field instead of S3 upload to keep the project focused.
- Recruiters maintain one company record by posting or editing jobs. Company name changes affect all jobs for that company.
- Application submission checks job status and deadline; duplicate applications return HTTP 409.
- Public registration supports student/recruiter roles only. Admin provisioning uses an explicit bootstrap profile.
- Recruiters update applied/shortlisted/rejected/selected statuses for applicants to their own jobs.
- Demo homepage profiles and reviews are presentation placeholders; they never create database records.
- Flyway applies versioned schema changes without invoking the destructive demo import scripts.
