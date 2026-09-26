import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const tokens = [
      "authjs.session-token",
      "__Secure-authjs.session-token",
      "authjs.csrf-token",
      "__Host-authjs.csrf-token",
      "authjs.callback-url",
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "next-auth.callback-url",
    ];

    for (const token of tokens) {
      cookieStore.delete(token);
    }

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Failed to log out" }, { status: 500 });
  }
}
