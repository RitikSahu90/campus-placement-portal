import { RowDataPacket } from "mysql2";
import db from "../config/db";

interface ProfileRow extends RowDataPacket {
  id: number;
  user_id: number;
  phone: string | null;
  department: string | null;
  graduation_year: number | null;
  cgpa: string | null;
  skills: string | null;
  resume_url: string | null;
  bio: string | null;
}

export async function getProfile(userId: number) {
  const [rows] = await db.query<ProfileRow[]>(
    "SELECT * FROM profiles WHERE user_id = ?",
    [userId]
  );

  return rows[0] || null;
}

export async function upsertProfile(
  userId: number,
  input: {
    phone?: string;
    department?: string;
    graduationYear?: number;
    cgpa?: number;
    skills?: string;
    resumeUrl?: string;
    bio?: string;
  }
) {
  await db.execute(
    `INSERT INTO profiles
      (user_id, phone, department, graduation_year, cgpa, skills, resume_url, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      phone = VALUES(phone),
      department = VALUES(department),
      graduation_year = VALUES(graduation_year),
      cgpa = VALUES(cgpa),
      skills = VALUES(skills),
      resume_url = VALUES(resume_url),
      bio = VALUES(bio)`,
    [
      userId,
      input.phone || null,
      input.department || null,
      input.graduationYear || null,
      input.cgpa || null,
      input.skills || null,
      input.resumeUrl || null,
      input.bio || null
    ]
  );

  return getProfile(userId);
}
