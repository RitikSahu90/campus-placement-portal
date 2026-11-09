# Verification of the professional portal update

Verified locally on 9 November 2026.

| Check | Result |
| --- | --- |
| Maven clean verify, Java 21 bytecode target (executed on JBR 25) | Pass: 20 tests |
| Frontend TypeScript and Vite production build | Pass |
| Local and production Docker Compose configuration parsing | Pass |
| Real-browser desktop and mobile workflows against Spring Boot + isolated H2 | Pass |
| Browser JavaScript page errors during those workflows | None |
| Horizontal overflow across the 13 captured desktop/mobile workflow views | None |
| Final axe WCAG 2 A/AA and 2.1 AA scans across 12 desktop/public/workspace states | No violations detected |
| Full production Docker / MySQL / Nginx runtime | Not run: Docker daemon unavailable |

Browser workflows covered login for all roles, searching and filtering jobs, empty search results, saving a profile with CGPA 10, applying to a job, recruiter status updates visible to the student, creating and deleting an opportunity, canceling a deletion confirmation, administrator self-deletion protection in the UI, mobile navigation, and a missing-page route.

The responsive workflow pass also scanned mobile home, jobs, student workspace, profile, and user guide pages. A contrast issue found on job detail metadata was subsequently corrected and the job detail page was rescanned successfully.

Backend tests cover signup and BCrypt, seeded login, expired/invalid/deleted-account JWTs, role enforcement, owned jobs, application ownership and statuses, profile upserts, safe resume URLs, duplicate applications, job state/deadlines, admin deletion and cascades, bootstrap admin validation, CORS, readiness probe privacy, fresh-schema migrations, and preservation of existing data during baseline/migration.

The automated browser tools were installed temporarily under `/tmp`; they are not production dependencies or part of GitHub Actions. CI runs the Maven suite and frontend build. Accessibility scans are automated checks, not a complete accessibility certification. H2 compatibility tests do not replace staging verification against MySQL.

Review screenshots use temporary demo data:

- [Desktop landing page](screenshots/home-desktop.png)
- [Mobile landing page](screenshots/home-mobile.png)
- [Student workspace](screenshots/student-desktop.png)
