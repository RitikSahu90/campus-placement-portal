import { RowDataPacket } from "mysql2";
import db from "../config/db";

export async function applyForJob(studentId: number, jobId: number, coverLetter?: string) {
  const [jobs] = await db.query<RowDataPacket[]>(
    "SELECT id, status, deadline FROM jobs WHERE id = ?",
    [jobId]
  );

  if (!jobs[0]) {
    const error = new Error("Job not found");
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }

  if (jobs[0].status !== "open") {
    const error = new Error("This job is closed");
    (error as Error & { statusCode?: number }).statusCode = 400;
    throw error;
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO applications (job_id, student_id, cover_letter) VALUES (?, ?, ?)",
      [jobId, studentId, coverLetter || null]
    );
    return getApplicationById(Number((result as { insertId: number }).insertId));
  } catch (error) {
    const duplicate = error as { code?: string };
    if (duplicate.code === "ER_DUP_ENTRY") {
      const apiError = new Error("You have already applied for this job");
      (apiError as Error & { statusCode?: number }).statusCode = 409;
      throw apiError;
    }
    throw error;
  }
}

export async function getApplicationById(id: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT applications.*, jobs.title, companies.name AS company_name
     FROM applications
     JOIN jobs ON jobs.id = applications.job_id
     JOIN companies ON companies.id = jobs.company_id
     WHERE applications.id = ?`,
    [id]
  );
  return rows[0];
}

export async function listApplicationsForStudent(studentId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT applications.*, jobs.title, jobs.location, jobs.salary, companies.name AS company_name
     FROM applications
     JOIN jobs ON jobs.id = applications.job_id
     JOIN companies ON companies.id = jobs.company_id
     WHERE applications.student_id = ?
     ORDER BY applications.applied_at DESC`,
    [studentId]
  );
  return rows;
}

export async function listApplicantsForRecruiter(recruiterId: number) {
  const [rows] = await db.query<RowDataPacket[]>(
    `SELECT applications.*, users.name AS student_name, users.email AS student_email,
            profiles.department, profiles.cgpa, profiles.skills, jobs.title AS job_title
     FROM applications
     JOIN jobs ON jobs.id = applications.job_id
     JOIN users ON users.id = applications.student_id
     LEFT JOIN profiles ON profiles.user_id = users.id
     WHERE jobs.recruiter_id = ?
     ORDER BY applications.applied_at DESC`,
    [recruiterId]
  );
  return rows;
}
