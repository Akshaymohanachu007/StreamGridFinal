import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {

  const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    family: 4,

    requireTLS: true,

    auth:{
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
    `

  });

};