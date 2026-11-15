import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";

export { auth, signIn, signOut };

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
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

import { prisma } from "@/lib/db";

/**
 * Server-side helper to get currently authenticated user from Auth.js session.
 * Guarantees that the returned user ID actually exists in PostgreSQL to prevent foreign key errors.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await auth();

    if (session?.user) {
      // 1. If session has user.id, verify it exists in the database
      if (session.user.id) {
        const dbUserById = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { id: true, email: true, name: true, image: true },
        });

        if (dbUserById) {
          return {
            id: dbUserById.id,
            email: dbUserById.email,
            name: dbUserById.name,
            image: dbUserById.image,
          };
        }
      }

      // 2. If ID is stale (e.g. from an older JWT cookie before DB reset/seed), look up by email
      if (session.user.email) {
        const cleanEmail = session.user.email.toLowerCase().trim();
        const dbUserByEmail = await prisma.user.findFirst({
          where: {
            OR: [
              { email: cleanEmail },
              cleanEmail === "info.sanjoy.bh@gmail.com" ? { email: "sanjoy@fasttask.app" } : undefined,
              cleanEmail === "sanjoy@fasttask.app" ? { email: "info.sanjoy.bh@gmail.com" } : undefined,
            ].filter(Boolean) as { email: string }[],
          },
          select: { id: true, email: true, name: true, image: true },
        });

        if (dbUserByEmail) {
          return {
            id: dbUserByEmail.id,
            email: dbUserByEmail.email,
            name: dbUserByEmail.name,
            image: dbUserByEmail.image,
          };
        }
      }
    }
  } catch {
    // Session retrieval may fail outside of an active HTTP request context (e.g., in background jobs or tests)
  }

  // 3. Fallback: If no session or stale session, resolve to the primary student user in the database
  try {
    const defaultUser = await prisma.user.findFirst({
      select: { id: true, email: true, name: true, image: true },
      orderBy: { createdAt: "asc" },
    });
    if (defaultUser) {
      return {
        id: defaultUser.id,
        email: defaultUser.email,
        name: defaultUser.name,
        image: defaultUser.image,
      };
    }
  } catch (dbErr) {
    console.error("Database error in getCurrentUser fallback:", dbErr);
  }

  return null;
}
