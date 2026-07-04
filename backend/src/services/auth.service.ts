import { RowDataPacket } from "mysql2";
import db from "../config/db";
import { UserRole } from "../types";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
}

function publicUser(user: UserRow) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const [existing] = await db.query<UserRow[]>("SELECT * FROM users WHERE email = ?", [
    input.email
  ]);

  if (existing.length > 0) {
    const error = new Error("Email is already registered");
    (error as Error & { statusCode?: number }).statusCode = 409;
    throw error;
  }

  const passwordHash = await hashPassword(input.password);
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [input.name, input.email, passwordHash, input.role]
  );

  const user = {
    id: Number((result as { insertId: number }).insertId),
    name: input.name,
    email: input.email,
    role: input.role
  };

  const token = signToken(user);
  return { user, token };
}

export async function loginUser(email: string, password: string) {
  const [rows] = await db.query<UserRow[]>("SELECT * FROM users WHERE email = ?", [email]);
  const user = rows[0];

  if (!user || !(await comparePassword(password, user.password_hash))) {
    const error = new Error("Invalid email or password");
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }

  const cleanUser = publicUser(user);
  const token = signToken(cleanUser);
  return { user: cleanUser, token };
}

export async function getUserById(id: number) {
  const [rows] = await db.query<UserRow[]>(
    "SELECT id, name, email, role, password_hash FROM users WHERE id = ?",
    [id]
  );

  if (!rows[0]) {
    const error = new Error("User not found");
    (error as Error & { statusCode?: number }).statusCode = 404;
    throw error;
  }

  return publicUser(rows[0]);
}
