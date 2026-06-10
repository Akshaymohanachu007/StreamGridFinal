import { Resend } from "resend";


export const sendOTP = async (email, otp) => {


  const resend = new Resend(
    process.env.RESEND_API_KEY
  );


  const { data, error } = await resend.emails.send({

    from: "StreamGrid <onboarding@resend.dev>",

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

    <p>
    Code expires in 10 minutes
    </p>

    </div>

    `

  });


  if (error) {

    console.log(error);

    throw new Error(error.message);

  }


  console.log(
    "OTP email sent:",
    data.id
  );


};