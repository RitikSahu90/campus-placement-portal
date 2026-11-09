# API Specification

Base URL: `http://localhost:5000/api`

All protected endpoints require:

```http
Authorization: Bearer <jwt>
```

Responses use this shape:

```json
{
  "success": true,
  "message": "Message",
  "data": {}
}
```

## Authentication

### POST /auth/register

Body:

```json
{
  "name": "Aarav Student",
  "email": "student@example.com",
  "password": "Password@123",
  "role": "student"
}
```

### POST /auth/login

Body:

```json
{
  "email": "student@example.com",
  "password": "Password@123"
}
```

### GET /auth/me

Protected. Returns the current user.

## Profile

### GET /profile

Student only. Returns the logged-in student's profile.

### PUT /profile

Student only.

Body:

```json
{
  "phone": "9876543210",
  "department": "Computer Science",
  "graduationYear": 2026,
  "cgpa": 8.7,
  "skills": "React, TypeScript, SQL",
  "resumeUrl": "https://example.com/resume.pdf",
  "bio": "Final year student"
}
```

## Jobs

### GET /jobs

Public. Returns all jobs.

### GET /jobs/:id

Public. Returns one job.

### POST /jobs

Recruiter only.

Body:

```json
{
  "companyName": "BluePeak Technologies",
  "title": "Frontend Developer Intern",
  "description": "Build React dashboards.",
  "location": "Remote",
  "salary": "25000/month",
  "jobType": "internship",
  "eligibilityCriteria": "CGPA 7.0 and above",
  "deadline": "2099-12-31",
  "status": "open"
}
```

### PUT /jobs/:id

Recruiter only. Updates an owned job.

### DELETE /jobs/:id

Recruiter or admin. Recruiters can delete only their own jobs.

## Applications

### POST /applications

Student only.

Body:

```json
{
  "jobId": 1,
  "coverLetter": "I am interested in this role."
}
```

### GET /applications

Student or recruiter.

- Students receive their applied jobs.
- Recruiters receive applicants for their jobs.

## Admin

### GET /users

Admin only. Returns all users.

### DELETE /users/:id

Admin only. Deletes a user and cascades related data.

### GET /jobs

Admins can use the same public jobs endpoint for viewing jobs.

### DELETE /jobs/:id

Admin only. Deletes any job.

## Spring Boot backend notes

- Existing paths, bearer authentication, response envelopes, and database response field names are preserved.
- Registration passwords must contain 8–72 characters; JWT secrets must have at least 32 UTF-8 bytes.
- Invalid request DTOs return HTTP 400. Duplicate emails/applications return HTTP 409.
- Closed or expired jobs reject applications with HTTP 400; eligibility text is not automatically evaluated.
- Profiles remain student-only. Recruiter edits/deletes require job ownership; admins can delete any job.
- `GET /health` is public and reports API availability, not a database readiness probe.
- Logout is performed in the React client by clearing its tab-scoped session JWT.
- Default token lifetime is one hour. Deleted accounts and changed roles invalidate existing tokens on subsequent API requests.
- Public registration accepts only `student` or `recruiter`; `admin` is rejected.
- Profiles accept CGPA 0–10 and HTTP/HTTPS resume links.

## Recruiter-owned jobs

### GET /jobs/mine

Recruiter only. Returns jobs owned by the current account. This route is matched before `/jobs/:id`.

## Application status updates

### PATCH /applications/:id/status

Recruiter only. The application must belong to one of the recruiter’s own jobs.

```json
{"status":"shortlisted"}
```

Allowed values: `applied`, `shortlisted`, `rejected`, `selected`. Returns the updated application. Wrong ownership returns 403; invalid status returns 400.

## Operational health

`GET /actuator/health` and `/actuator/health/readiness` are outside the `/api` base path. Readiness includes the database check. These are intended for internal container health checks and do not expose component details. They are not automatically proxied through the frontend’s `/api` location.

An administrator cannot delete their own account (400). Nginx rejects oversized bodies and rate-limits login/signup traffic; direct development API requests do not pass through Nginx.
