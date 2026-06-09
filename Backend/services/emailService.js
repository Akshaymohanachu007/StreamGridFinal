import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {

  const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    family: 4,   // 👈 FORCE IPv4

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }

  });


  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: email,

    subject:"StreamGrid Verification Code",

    html:
    `
    <h2>Your OTP Code</h2>
    <h1>${otp}</h1>
    <p>This expires in 10 minutes</p>
    `

  });

};