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
  "deadline": "2026-08-15",
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
