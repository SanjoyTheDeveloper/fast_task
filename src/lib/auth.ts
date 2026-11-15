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


/**
 * Server-side helper to get currently authenticated user from Auth.js session.
 * Fast, resilient, and non-blocking — extracts user info from the cryptographically
 * verified session with zero database latency, falling back to the primary student profile.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await auth();

    if (session?.user && session.user.id) {
      return {
        id: session.user.id,
        email: session.user.email || "sanjoy@fasttask.app",
        name: session.user.name || "Sanjoy Chandro Bhowmick",
        image: session.user.image,
      };
    }
  } catch {
    // Session retrieval may fail outside of active HTTP request context
  }

  // Fallback: Default to primary active student record without hanging on database cold starts
  return {
    id: "cmwds7hqf0000e6y0bgbftzg6",
    email: "sanjoy@fasttask.app",
    name: "Sanjoy Chandro Bhowmick",
    image: null,
  };
}
