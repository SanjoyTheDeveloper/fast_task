import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";

export { auth, signIn, signOut };

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

/**
 * Hashes password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verifies plain-text password against bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Server-side helper to get currently authenticated user from Auth.js session.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) return null;

    return {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || "User",
    };
  } catch (error) {
    console.error("Error retrieving current Auth.js user:", error);
    return null;
  }
}
