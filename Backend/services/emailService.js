import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTP = async (email, otp) => {
  const { error } = await resend.emails.send({
    from: "StreamGrid <onboarding@resend.dev>", // use your verified domain here once set up
    to: email,
    subject: "StreamGrid – Your Verification Code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;background:#111;border-radius:12px;color:#fff;text-align:center">
        <h2 style="margin-bottom:8px">StreamGrid</h2>
        <p style="color:#aaa;margin-bottom:32px">Enter this code to verify your account</p>
        <div style="background:#1e1e2e;border-radius:8px;padding:24px;letter-spacing:12px;font-size:40px;font-weight:bold;color:#7c3aed">
          ${otp}
        </div>
        <p style="color:#aaa;font-size:13px;margin-top:24px">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  });

  if (error) {
    console.error("[emailService] Resend error:", error);
    throw new Error("Failed to send verification email. Please try again later.");
  }
};