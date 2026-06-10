import nodemailer from "nodemailer";


export const sendOTP = async (email, otp) => {


  const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    tls: {
      servername: "smtp.gmail.com"
    },

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }

  });


  await transporter.sendMail({

    from: `StreamGrid <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "StreamGrid - Your Verification Code",

    html: `

    <h1>StreamGrid</h1>

    <h2>${otp}</h2>

    <p>Code expires in 10 minutes</p>

    `

  });


  console.log("OTP email sent");

};