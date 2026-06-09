import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {

  // Use explicit host + port instead of service:'gmail'
  // to avoid IPv6 ECONNREFUSED issues on some networks.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS on port 587
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Force IPv4 to avoid ECONNREFUSED on IPv6 addresses
      family: 4,
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.sendMail({
      from: `"StreamGrid" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "StreamGrid Verification Code",
      html: `
        <h2>Your OTP Code</h2>
        <h1 style="letter-spacing:8px;font-size:48px;color:#7c3aed">${otp}</h1>
        <p>This code expires in 10 minutes</p>
      `,
    });
  } catch (err) {
    console.error("[emailService] Failed to send OTP email:", err.message);
    throw new Error("Failed to send verification email. Please try again later.");
  }
};