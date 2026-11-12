import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";
import { POST as loginHandler } from "../src/app/api/auth/login/route";
import { NextRequest } from "next/server";

async function runAuthTests() {
  console.log("\n=======================================================");
  console.log("🔐 TESTING LOGIN & AUTHENTICATION LOGIC WITH NEON DB");
  console.log("=======================================================\n");

  // 1. Direct DB user & bcrypt check
  console.log("Test 1: User lookup & bcrypt verification in Neon DB");
  const user = await prisma.user.findUnique({
    where: { email: "sanjoy@fasttask.app" },
  });

  if (!user) {
    console.error("❌ Test 1 FAILED: User sanjoy@fasttask.app does not exist in Neon DB");
  } else {
    console.log(`✅ Test 1.1: User found in Neon DB: ${user.name} (${user.email})`);
    console.log(`   - emailVerified: ${user.emailVerified}`);
    console.log(`   - role: ${user.role}`);

    const isMatch = await bcrypt.compare("password123", user.password);
    if (isMatch) {
      console.log("✅ Test 1.2: bcrypt.compare('password123') MATCHED hash successfully");
    } else {
      console.error("❌ Test 1.2 FAILED: Password hash did not match 'password123'");
    }
  }

  // 2. Test Login API endpoint with primary email (sanjoy@fasttask.app)
  console.log("\nTest 2: POST /api/auth/login with primary email (sanjoy@fasttask.app)");
  const reqValid = new NextRequest("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "sanjoy@fasttask.app",
      password: "password123",
    }),
  });

  const resValid = await loginHandler(reqValid);
  const dataValid = await resValid.json();
  console.log(`   - HTTP Status: ${resValid.status}`);
  console.log("   - Response payload:", dataValid);

  if (resValid.status === 200 && dataValid.user?.id === user?.id) {
    console.log("✅ Test 2: Login API passed with primary email");
  } else {
    console.error("❌ Test 2 FAILED: Login API returned unexpected response");
  }

  // 3. Test Login API with developer personal email alias (info.sanjoy.bh@gmail.com)
  console.log("\nTest 3: POST /api/auth/login with alias (info.sanjoy.bh@gmail.com)");
  const reqAlias = new NextRequest("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "info.sanjoy.bh@gmail.com",
      password: "password123",
    }),
  });

  const resAlias = await loginHandler(reqAlias);
  const dataAlias = await resAlias.json();
  console.log(`   - HTTP Status: ${resAlias.status}`);
  console.log("   - Response payload:", dataAlias);

  if (resAlias.status === 200 && dataAlias.user?.id === user?.id) {
    console.log("✅ Test 3: Login API passed with developer alias email");
  } else {
    console.error("❌ Test 3 FAILED: Developer alias login failed");
  }

  // 4. Test Login API endpoint with invalid password
  console.log("\nTest 4: POST /api/auth/login with wrong password");
  const reqInvalid = new NextRequest("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "sanjoy@fasttask.app",
      password: "wrong_password_999",
    }),
  });

  const resInvalid = await loginHandler(reqInvalid);
  const dataInvalid = await resInvalid.json();
  console.log(`   - HTTP Status: ${resInvalid.status}`);
  console.log("   - Response payload:", dataInvalid);

  if (resInvalid.status === 401 && dataInvalid.message === "Invalid email or password") {
    console.log("✅ Test 4: Correctly rejected invalid password with 401");
  } else {
    console.error("❌ Test 4 FAILED: Incorrect rejection behavior");
  }

  // 5. Test Login API with nonexistent email
  console.log("\nTest 5: POST /api/auth/login with nonexistent email");
  const reqNonexistent = new NextRequest("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "nonexistent.random.user@gmail.com",
      password: "somepassword123",
    }),
  });

  const resNonexistent = await loginHandler(reqNonexistent);
  const dataNonexistent = await resNonexistent.json();
  console.log(`   - HTTP Status: ${resNonexistent.status}`);
  console.log("   - Response payload:", dataNonexistent);

  if (resNonexistent.status === 401) {
    console.log("✅ Test 5: Correctly rejected nonexistent user with 401");
  } else {
    console.error("❌ Test 5 FAILED: Expected 401 for nonexistent user");
  }

  // Verify that Neon DB record was NOT mutated
  const verifyDbUser = await prisma.user.findUnique({
    where: { email: "sanjoy@fasttask.app" },
  });
  if (verifyDbUser && (await bcrypt.compare("password123", verifyDbUser.password))) {
    console.log("\n✅ Security Integrity Verified: Neon DB user record remained intact and immutable.");
  } else {
    console.error("\n❌ Security Failure: User record was mutated during tests!");
  }
}

runAuthTests()
  .catch((e) => {
    console.error("Fatal test error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
