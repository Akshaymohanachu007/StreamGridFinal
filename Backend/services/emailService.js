import nodemailer from "nodemailer";


export const sendOTP = async (email, otp) => {

  const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000

  });


  await transporter.sendMail({

    from: `StreamGrid <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "StreamGrid - Your Verification Code",

    html: `

      <div style="
      font-family:sans-serif;
      text-align:center;
      ">

        <h1>StreamGrid</h1>

        <p>Your verification code:</p>

        <h2 style="
        letter-spacing:10px;
        color:#7c3aed;
        ">
        ${otp}
        </h2>

        <p>Code expires in 10 minutes</p>

      </div>

    `

  });


  console.log("OTP email sent");

};