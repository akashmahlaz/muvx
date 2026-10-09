import { Resend } from "resend"

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  console.log("[EMAIL] Initializing Resend client, API key exists:", !!apiKey)
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set in environment variables")
  }
  return new Resend(apiKey)
}

const FROM_EMAIL = process.env.RESEND_FROM_ADDRESS || "team@punjabtech.online"

type OtpType = "sign-in" | "email-verification" | "forget-password" | "change-email"

interface SendOtpParams {
  email: string
  otp: string
  type: OtpType
}

function getOtpEmailContent(type: OtpType, otp: string): {
  subject: string
  html: string
  text: string
} {
  console.log("[EMAIL] Building email content for type:", type, "otp:", otp)
  if (type === "sign-in") {
    return {
      subject: "Your Muvx Login Code",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #16181d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #f5f2ec; font-size: 24px; margin: 0;">Muvx</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
            <p style="color: #4a4e57; font-size: 16px; margin: 0 0 24px;">Your login code is:</p>
            <div style="background: #f5f2ec; padding: 20px 40px; border-radius: 8px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16181d;">${otp}</span>
            </div>
            <p style="color: #73757a; font-size: 14px; margin: 24px 0 0;">This code expires in 10 minutes.</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
      `,
      text: `Your Muvx login code is: ${otp}. This code expires in 10 minutes.`,
    }
  }

  if (type === "email-verification") {
    return {
      subject: "Verify Your Muvx Account",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #16181d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #f5f2ec; font-size: 24px; margin: 0;">Muvx</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
            <p style="color: #4a4e57; font-size: 16px; margin: 0 0 24px;">Verify your email to complete signup:</p>
            <div style="background: #f5f2ec; padding: 20px 40px; border-radius: 8px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16181d;">${otp}</span>
            </div>
            <p style="color: #73757a; font-size: 14px; margin: 24px 0 0;">This code expires in 10 minutes.</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">If you didn't create a Muvx account, ignore this email.</p>
          </div>
        </div>
      `,
      text: `Verify your Muvx account: ${otp}. This code expires in 10 minutes.`,
    }
  }

  if (type === "forget-password") {
    return {
      subject: "Reset Your Muvx Password",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #16181d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #f5f2ec; font-size: 24px; margin: 0;">Muvx</h1>
          </div>
          <div style="background: #ffffff; padding: 32px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
            <p style="color: #4a4e57; font-size: 16px; margin: 0 0 24px;">Your password reset code is:</p>
            <div style="background: #f5f2ec; padding: 20px 40px; border-radius: 8px; display: inline-block;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16181d;">${otp}</span>
            </div>
            <p style="color: #73757a; font-size: 14px; margin: 24px 0 0;">This code expires in 10 minutes.</p>
            <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">If you didn't request a password reset, ignore this email.</p>
          </div>
        </div>
      `,
      text: `Your Muvx password reset code is: ${otp}. This code expires in 10 minutes.`,
    }
  }

  return {
    subject: "Verify Your New Email",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="background: #16181d; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #f5f2ec; font-size: 24px; margin: 0;">Muvx</h1>
        </div>
        <div style="background: #ffffff; padding: 32px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e5e5;">
          <p style="color: #4a4e57; font-size: 16px; margin: 0 0 24px;">Your email change code is:</p>
          <div style="background: #f5f2ec; padding: 20px 40px; border-radius: 8px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #16181d;">${otp}</span>
          </div>
          <p style="color: #73757a; font-size: 14px; margin: 24px 0 0;">This code expires in 10 minutes.</p>
        </div>
      </div>
    `,
    text: `Your Muvx email change code is: ${otp}. This code expires in 10 minutes.`,
  }
}

export async function sendOtpEmail({ email, otp, type }: SendOtpParams) {
  console.log("[EMAIL] === sendOtpEmail called ===")
  console.log("[EMAIL] Params:", { email, otp, type })
  console.log("[EMAIL] FROM_EMAIL:", FROM_EMAIL)

  try {
    const resend = getResendClient()
    const { subject, html, text } = getOtpEmailContent(type, otp)

    console.log("[EMAIL] Sending email via Resend...")
    console.log("[EMAIL] Subject:", subject)
    console.log("[EMAIL] To:", email)

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
      text,
    })

    console.log("[EMAIL] Resend response:", JSON.stringify(result, null, 2))

    if (result.error) {
      console.error("[EMAIL] Resend returned error:", result.error)
      throw new Error(`Resend error: ${JSON.stringify(result.error)}`)
    }

    console.log("[EMAIL] ✅ Email sent successfully, ID:", result.data?.id)
    return result
  } catch (err) {
    console.error("[EMAIL] ❌ Failed to send email:", err)
    if (err instanceof Error) {
      console.error("[EMAIL] Error message:", err.message)
      console.error("[EMAIL] Error stack:", err.stack)
    }
    throw err
  }
}
