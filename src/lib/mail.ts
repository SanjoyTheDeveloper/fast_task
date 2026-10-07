import nodemailer from "nodemailer";

/**
 * Nodemailer Gmail Transporter Configuration
 * Uses EMAIL_USER and EMAIL_PASS (Google App Password) from .env
 */
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  error?: string | null;
}

/**
 * Sends a 6-digit OTP verification code via Gmail SMTP (Nodemailer)
 * Includes both the 6-digit code and a one-click verification link
 *
 * @param email - Recipient email address
 * @param code - 6-digit verification code (OTP)
 */
export async function sendVerificationEmail(
  email: string,
  code: string
): Promise<SendMailResult> {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const verificationUrl = `${baseUrl.replace(/\/$/, "")}/verify-email?code=${encodeURIComponent(
    code
  )}&email=${encodeURIComponent(email)}`;

  const fromAddress =
    process.env.EMAIL_FROM ||
    `"FastTask" <${emailUser || "no-reply@fasttask.app"}>`;

  console.log("\n============================================================");
  console.log("📧 [NODEMAILER / GMAIL] SENDING VERIFICATION OTP");
  console.log("============================================================");
  console.log(`  To:           ${email}`);
  console.log(`  From:         ${fromAddress}`);
  console.log(`  Code (OTP):   ${code}`);
  console.log(`  Direct Link:  ${verificationUrl}`);
  console.log("============================================================\n");

  if (!emailUser || !emailPass || emailUser.includes("your-email")) {
    const errorMsg =
      "EMAIL_USER or EMAIL_PASS is not configured in .env. Please configure your Gmail credentials.";
    console.error(`❌ [Nodemailer Error]: ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
    };
  }

  const subject = `${code} is your FastTask verification code`;

  // HTML email template with responsive styling, 6-digit OTP block, and instant link
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 40px 16px;
    }
    .email-card {
      max-width: 540px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
    }
    .header {
      padding: 32px 32px 20px;
      text-align: center;
      background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
      border-bottom: 1px solid #f1f5f9;
    }
    .brand-icon {
      display: inline-block;
      width: 44px;
      height: 44px;
      line-height: 44px;
      background: #2563eb;
      color: #ffffff;
      border-radius: 12px;
      font-weight: 800;
      font-size: 20px;
      text-align: center;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .content {
      padding: 32px;
      text-align: center;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 12px;
      letter-spacing: -0.01em;
    }
    .description {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 28px;
      line-height: 1.6;
    }
    .otp-box {
      background: #f8fafc;
      border: 2px dashed #93c5fd;
      border-radius: 16px;
      padding: 20px 24px;
      margin: 0 auto 24px;
      display: inline-block;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #3b82f6;
      margin-bottom: 8px;
      display: block;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #1e3a8a;
      padding-left: 10px;
      user-select: all;
    }
    .expiry-badge {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 28px;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .divider {
      margin: 28px 0;
      border: 0;
      border-top: 1px solid #f1f5f9;
    }
    .link-note {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.6;
      word-break: break-all;
    }
    .link-note a {
      color: #2563eb;
      text-decoration: underline;
    }
    .footer {
      padding: 24px 32px;
      background-color: #f8fafc;
      border-top: 1px solid #f1f5f9;
      font-size: 12px;
      color: #94a3b8;
      text-align: center;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">
      <div class="header">
        <div class="brand-icon">✓</div>
        <h1 class="brand-title">FastTask</h1>
      </div>

      <div class="content">
        <h2 class="title">Verify Your Email Address</h2>
        <p class="description">
          Thank you for joining FastTask! Enter the 6-digit verification code below to verify your account:
        </p>

        <div class="otp-box">
          <span class="otp-label">Verification Code</span>
          <div class="otp-code">${code}</div>
        </div>

        <div>
          <span class="expiry-badge">⏱️ Valid for 10 minutes</span>
        </div>

        <div>
          <a href="${verificationUrl}" class="button" target="_blank" rel="noopener noreferrer">
            Verify Email Instantly
          </a>
        </div>

        <hr class="divider" />

        <p class="link-note">
          If the button does not work, visit this direct link:<br>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>

        <p class="link-note" style="margin-top: 16px;">
          If you did not register for a FastTask account, please ignore this email.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} FastTask • High performance personal task management.<br />
        This is an automated security message. Please do not reply directly.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
FastTask Verification Code

Your 6-digit verification code is: ${code}

This code will expire in 10 minutes.

Alternatively, you can verify your account by clicking the link below:
${verificationUrl}

If you did not create a FastTask account, you can safely ignore this email.

© ${new Date().getFullYear()} FastTask
  `.trim();

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject,
      text,
      html,
    });

    console.log("✅ [Nodemailer Success] Email delivered!");
    console.log(`   Message ID: ${info.messageId}`);
    console.log("============================================================\n");

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    const errorMessage = error?.message || "Failed to send email via Gmail SMTP";
    console.error("❌ [Nodemailer Exception]:", errorMessage);
    console.log("============================================================\n");
    return {
      success: false,
      error: errorMessage,
    };
  }
}
