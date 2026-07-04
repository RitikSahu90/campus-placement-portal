import { RowDataPacket } from "mysql2";
import db from "../config/db";

export interface JobInput {
  companyName?: string;
  companyWebsite?: string;
  companyLocation?: string;
  companyDescription?: string;
  title: string;
  description: string;
  location: string;
  salary?: string;
  jobType?: "internship" | "full-time" | "part-time";
  eligibilityCriteria?: string;
  deadline: string;
  status?: "open" | "closed";
}

interface JobRow extends RowDataPacket {
  id: number;
  company_id: number;
  recruiter_id: number;
  title: string;
  description: string;
  location: string;
  salary: string | null;
  job_type: string;
  eligibility_criteria: string | null;
  deadline: string;
  status: string;
  company_name: string;
  recruiter_name: string;
}

async function getOrCreateCompany(recruiterId: number, input: JobInput) {
  const [companies] = await db.query<RowDataPacket[]>(
    "SELECT id FROM companies WHERE recruiter_id = ? ORDER BY id LIMIT 1",
    [recruiterId]
  );

  if (companies[0]) {
    if (input.companyName) {
      await db.execute(
        `UPDATE companies
         SET name = ?, website = ?, location = ?, description = ?
         WHERE id = ? AND recruiter_id = ?`,
        [
          input.companyName,
          input.companyWebsite || null,
          input.companyLocation || null,
          input.companyDescription || null,
          companies[0].id,
          recruiterId
        ]
      );
    }

    return Number(companies[0].id);
  }

  const [result] = await db.execute(
    `INSERT INTO companies (recruiter_id, name, website, location, description)
     VALUES (?, ?, ?, ?, ?)`,
    [
      recruiterId,
      input.companyName || "My Company",
      input.companyWebsite || null,
      input.companyLocation || input.location,
      input.companyDescription || null
    ]
  );

  return Number((result as { insertId: number }).insertId);
}

export async function listJobs(filters: { recruiterId?: number } = {}) {
  const values: number[] = [];
  let sql = `
    SELECT jobs.*, companies.name AS company_name, users.name AS recruiter_name
    FROM jobs
    JOIN companies ON companies.id = jobs.company_id
    JOIN users ON users.id = jobs.recruiter_id`;

  if (filters.recruiterId) {
    sql += " WHERE jobs.recruiter_id = ?";
    values.push(filters.recruiterId);
  }

  sql += " ORDER BY jobs.created_at DESC";

  const [rows] = await db.query<JobRow[]>(sql, values);
  return rows;
}

export async function getJobById(id: number) {
  const [rows] = await db.query<JobRow[]>(
    `SELECT jobs.*, companies.name AS company_name, users.name AS recruiter_name
     FROM jobs
     JOIN companies ON companies.id = jobs.company_id
     JOIN users ON users.id = jobs.recruiter_id
     WHERE jobs.id = ?`,
    [id]
  );

  if (!rows[0]) {
    const error = new Error("Job not found");
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }

  return rows[0];
}

export async function createJob(recruiterId: number, input: JobInput) {
  const companyId = await getOrCreateCompany(recruiterId, input);
  const [result] = await db.execute(
    `INSERT INTO jobs
      (company_id, recruiter_id, title, description, location, salary, job_type, eligibility_criteria, deadline, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      companyId,
      recruiterId,
      input.title,
      input.description,
      input.location,
      input.salary || null,
      input.jobType || "full-time",
      input.eligibilityCriteria || null,
      input.deadline,
      input.status || "open"
    ]
  );

  return getJobById(Number((result as { insertId: number }).insertId));
}

export async function updateJob(id: number, recruiterId: number, input: JobInput) {
  await getJobById(id);
  const [result] = await db.execute(
    `UPDATE jobs
     SET title = ?, description = ?, location = ?, salary = ?, job_type = ?,
         eligibility_criteria = ?, deadline = ?, status = ?
     WHERE id = ? AND recruiter_id = ?`,
    [
      input.title,
      input.description,
      input.location,
      input.salary || null,
      input.jobType || "full-time",
      input.eligibilityCriteria || null,
      input.deadline,
      input.status || "open",
      id,
      recruiterId
    ]
  );

  if ((result as { affectedRows: number }).affectedRows === 0) {
    const error = new Error("Only the job owner can update this job");
    (error as Error & { statusCode?: number }).statusCode = 403;
    throw error;
  }

  return getJobById(id);
}

export async function deleteJob(id: number, actor: { userId: number; isAdmin?: boolean }) {
  const sql = actor.isAdmin ? "DELETE FROM jobs WHERE id = ?" : "DELETE FROM jobs WHERE id = ? AND recruiter_id = ?";
  const values = actor.isAdmin ? [id] : [id, actor.userId];
  const [result] = await db.execute(sql, values);

  if ((result as { affectedRows: number }).affectedRows === 0) {
    const error = new Error("Job not found or not allowed");
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }
}
