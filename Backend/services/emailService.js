import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {

  
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "StreamGrid Verification Code",
    html: `
      <h2>Your OTP Code</h2>
      <h1>${otp}</h1>
      <p>This code expires in 10 minutes</p>
    `,
  });
};