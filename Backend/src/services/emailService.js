const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail' ,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


transporter.verify((error, success)=>{
    if(error){
        console.log("Gmail Services connection services failed")
    }else{
        console.log('Gmail configured properly and ready to send email')
    }
})

const sendOtpToEmail = async(email,otp)=>{
    const html = `
  <div style="font-family: Helvetica, Arial, sans-serif; background:#f0f2f5; padding:30px 10px;">

    <div style="max-width:480px; margin:auto; background:#ffffff; border-radius:8px; padding:25px;">

      <!-- Header -->
      <h2 style="color:#128C7E; text-align:center; margin-bottom:10px;">
        WhatsApp
      </h2>
      <p style="text-align:center; color:#555; font-size:14px; margin-top:0;">
        Secure your account
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

      <!-- Body -->
      <p style="font-size:15px;">Hi,</p>

      <p style="font-size:15px;">
        Your verification code for WhatsApp Web is:
      </p>

      <!-- OTP -->
      <div style="text-align:center; margin:25px 0;">
        <span style="
          display:inline-block;
          font-size:30px;
          font-weight:bold;
          letter-spacing:6px;
          color:#000;
          padding:12px 20px;
          border:1px solid #ddd;
          border-radius:6px;
          background:#fafafa;
        ">
          ${otp}
        </span>
      </div>

      <p style="font-size:14px; color:#444;">
        This code will expire in <strong>5 minutes</strong>.
      </p>

      <p style="font-size:14px; color:#444;">
        For your security, do not share this code.
      </p>

      <p style="font-size:14px; color:#444;">
        If you didn’t request this code, you can ignore this email.
      </p>

      <!-- Footer -->
      <p style="margin-top:25px; font-size:14px;">
        — WhatsApp Team
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

      <p style="font-size:12px; color:#999; text-align:center;">
        This message was sent to you because you requested a verification code.
        <br/>
        Please do not reply to this email.
      </p>

    </div>

  </div>
  `;

  await transporter.sendMail({
    from : `YaariChatApp < ${process.env.EMAIL_USER}`,
    to : email,
    subject: 'Your YaariChat Verification Code'
  });
}


module.exports = sendOtpToEmail;