import { RowDataPacket } from "mysql2";
import db from "../config/db";
import { listJobs } from "./job.service";

export async function listUsers() {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
  );
  return rows;
}

export async function deleteUser(id: number) {
  const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);

  if ((result as { affectedRows: number }).affectedRows === 0) {
    const error = new Error("User not found");
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }
}

export async function listAllJobs() {
  return listJobs();
}
