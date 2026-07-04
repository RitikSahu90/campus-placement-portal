# Project Overview

Campus Placement Portal is a simple placement management system for students, recruiters, and admins.

The project intentionally avoids heavy abstractions such as Prisma, GraphQL, Next.js, and microservices. It uses explicit SQL and clear Express services so the code is easy to explain in a placement interview.

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

The backend uses a route-controller-service structure:

- Routes define URL mappings and middleware.
- Controllers read request data and return responses.
- Services contain business logic and SQL queries.
- Middleware handles authentication, authorization, validation, and errors.

The frontend uses React Router for pages, an auth context for session state, and Axios service modules for API calls.

## Assumptions

- Resume upload is stored as a URL field instead of S3 upload to keep the project focused.
- Recruiters can maintain one company record by posting or editing jobs.
- Admin registration is allowed for local/demo use. In production, admin creation should be restricted.
- Application status updates are modeled in the database, but the UI keeps the workflow simple.
