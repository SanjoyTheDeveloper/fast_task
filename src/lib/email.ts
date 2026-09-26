import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_for_build");

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  data?: { id: string } | null;
  error?: string | null;
}

/**
 * General helper to send emails via Resend with comprehensive error and success logging
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.EMAIL_FROM || "FastTask <onboarding@resend.dev>",
  replyTo,
}: SendEmailOptions): Promise<SendEmailResult> {
  const recipient = Array.isArray(to) ? to.join(", ") : to;
  const isTestingSender = from.includes("onboarding@resend.dev");

  console.log("\n============================================================");
  console.log("📧 [RESEND] INITIATING EMAIL DISPATCH");
  console.log("============================================================");
  console.log(`  To:      ${recipient}`);
  console.log(`  From:    ${from}`);
  console.log(`  Subject: ${subject}`);

  if (isTestingSender) {
    console.log("\n⚠️  [RESEND SANDBOX REMINDER]:");
    console.log("   Using 'onboarding@resend.dev' free test domain.");
    console.log("   Resend will ONLY deliver to the email address registered with your Resend account!");
    console.log("   To send to any external Gmail address, verify your domain at https://resend.com/domains\n");
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === "re_xxxxxxxxx" || apiKey.includes("placeholder")) {
      const errorMsg =
        "RESEND_API_KEY is not configured or still set to placeholder in .env. Email cannot be delivered.";
      console.error(`❌ [Resend Error]: ${errorMsg}`);
      console.log("============================================================\n");
      return {
        success: false,
        error: errorMsg,
      };
    }

    const client = new Resend(apiKey);

    console.log("[Resend] Sending API request to Resend...");
    const response = await client.emails.send({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ""), // Stripped plain text fallback
      replyTo,
    });

    if (response.error) {
      console.error("\n❌ [Resend Error From API]:", response.error.message || response.error);
      if (response.error.message?.includes("testing emails to your own email address") || response.error.message?.includes("verify a domain")) {
        console.warn("\n⚠️  [Resend Restriction Triggered]:");
        console.warn("   Resend blocked this delivery because 'onboarding@resend.dev' can only send");
        console.warn("   to your own Resend account email address.");
        console.warn("   -> Solution: Register/test with your Resend account email, OR verify a domain in Resend.\n");
      }
      console.log("============================================================\n");
      return {
        success: false,
        error: response.error.message || "Failed to send email via Resend.",
      };
    }

    console.log("\n✅ [Resend Success]: Email accepted for delivery!");
    console.log(`   Message ID: ${response.data?.id}`);
    console.log("============================================================\n");

    return {
      success: true,
      data: response.data as { id: string } | null,
    };
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred while sending email.";
    console.error("\n❌ [Resend Exception]:", errorMessage);
    console.log("============================================================\n");
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Sends a professional verification email with a secure token link
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<SendEmailResult> {
  const fromAddress = process.env.EMAIL_FROM || "FastTask <onboarding@resend.dev>";
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const verificationUrl = `${baseUrl.replace(/\/$/, "")}/verify-email?token=${encodeURIComponent(
    token
  )}`;

  console.log(`\n------------------------------------------------------------`);
  console.log(`🔗 [VERIFICATION LINK GENERATED]`);
  console.log(`   Recipient: ${email}`);
  console.log(`   URL:       ${verificationUrl}`);
  console.log(`------------------------------------------------------------`);

  const subject = "Verify your email – FastTask";

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
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 16px;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    }
    .header {
      padding: 32px 32px 24px;
      border-bottom: 1px solid #f1f5f9;
      text-align: center;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.02em;
      text-decoration: none;
    }
    .brand-badge {
      display: inline-block;
      width: 32px;
      height: 32px;
      line-height: 32px;
      background-color: #2563eb;
      color: #ffffff;
      border-radius: 8px;
      font-weight: 900;
      text-align: center;
      font-size: 16px;
    }
    .content {
      padding: 32px;
      line-height: 1.6;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 16px;
      letter-spacing: -0.01em;
    }
    .paragraph {
      font-size: 15px;
      color: #475569;
      margin: 0 0 24px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      padding: 13px 32px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .link-alt {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 24px;
      word-break: break-all;
      font-size: 13px;
      color: #64748b;
    }
    .link-alt a {
      color: #2563eb;
      text-decoration: none;
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
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <span class="brand">
          <span class="brand-badge">✓</span>
          <span>FastTask</span>
        </span>
      </div>
      <div class="content">
        <h1 class="title">Confirm your email address</h1>
        <p class="paragraph">
          Thanks for signing up for FastTask! To finalize your personal workspace and protect your account, please verify your email address by clicking the button below:
        </p>
        <div class="button-container">
          <a href="${verificationUrl}" class="button" target="_blank" rel="noopener noreferrer">
            Verify Email Address
          </a>
        </div>
        <p class="paragraph" style="font-size: 13px; color: #64748b; margin-bottom: 8px;">
          If the button above does not work, copy and paste this link into your browser:
        </p>
        <div class="link-alt">
          <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer">${verificationUrl}</a>
        </div>
        <p class="paragraph" style="font-size: 13px; color: #94a3b8; margin-top: 24px; margin-bottom: 0;">
          This verification link expires in 24 hours. If you did not create a FastTask account, please ignore this email.
        </p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} FastTask. High performance personal task management.<br />
        This is an automated message. Please do not reply directly to this email.
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Verify your email – FastTask

Please confirm your email address by visiting the link below:

${verificationUrl}

This verification link will expire in 24 hours. If you did not create an account, you can safely ignore this email.

© ${new Date().getFullYear()} FastTask
  `.trim();

  const result = await sendEmail({
    to: email,
    subject,
    html,
    text,
    from: fromAddress,
  });

  if (result.success) {
    console.log(
      `[sendVerificationEmail] ✓ Verification email successfully delivered to Resend for ${email} (ID: ${result.data?.id})`
    );
  } else {
    console.error(
      `[sendVerificationEmail] ✗ Failed to send verification email to ${email}. Error: ${result.error}`
    );
  }

  return result;
}
