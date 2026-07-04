# Database Design

Database name: `campus_placement_portal`

## Tables

### users

Stores authentication and role information.

| Column | Type | Notes |
| --- | --- | --- |
| id | INT | Primary key |
| name | VARCHAR(100) | Required |
| email | VARCHAR(150) | Required, unique |
| password_hash | VARCHAR(255) | bcrypt hash |
| role | ENUM | student, recruiter, admin |
| created_at | TIMESTAMP | Auto set |
| updated_at | TIMESTAMP | Auto update |

### profiles

Stores student profile details.

| Column | Type | Notes |
| --- | --- | --- |
| id | INT | Primary key |
| user_id | INT | Unique FK to users |
| phone | VARCHAR(20) | Optional |
| department | VARCHAR(100) | Optional |
| graduation_year | INT | Optional |
| cgpa | DECIMAL(3,2) | Optional |
| skills | TEXT | Optional |
| resume_url | VARCHAR(255) | Optional |
| bio | TEXT | Optional |

### companies

Stores recruiter company information.

| Column | Type | Notes |
| --- | --- | --- |
| id | INT | Primary key |
| recruiter_id | INT | FK to users |
| name | VARCHAR(150) | Required |
| website | VARCHAR(255) | Optional |
| location | VARCHAR(120) | Optional |
| description | TEXT | Optional |

### jobs

Stores campus job openings.

| Column | Type | Notes |
| --- | --- | --- |
| id | INT | Primary key |
| company_id | INT | FK to companies |
| recruiter_id | INT | FK to users |
| title | VARCHAR(150) | Required |
| description | TEXT | Required |
| location | VARCHAR(120) | Required |
| salary | VARCHAR(80) | Optional |
| job_type | ENUM | internship, full-time, part-time |
| eligibility_criteria | TEXT | Optional |
| deadline | DATE | Required |
| status | ENUM | open, closed |

### applications

Stores student applications for jobs.

| Column | Type | Notes |
| --- | --- | --- |
| id | INT | Primary key |
| job_id | INT | FK to jobs |
| student_id | INT | FK to users |
| status | ENUM | applied, shortlisted, rejected, selected |
| cover_letter | TEXT | Optional |
| applied_at | TIMESTAMP | Auto set |

## Constraints and Indexes

- `users.email` is unique.
- `profiles.user_id` is unique.
- `applications` has a unique constraint on `(job_id, student_id)` to prevent duplicate applications.
- Foreign keys cascade deletes from users, companies, and jobs.
- Indexes are added for role, job status/deadline, recruiter jobs, student applications, and application status.
