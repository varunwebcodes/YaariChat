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
        console.log("Gmail services connection services failed")
    }else{
        console.log('Gmail configured properly and ready to send email')
    }
});

const sendOtpToEmail = async (email, otp) => {
  const html = `
  <div style="margin:0; padding:0; background:#eef2f5; font-family: Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
      <tr>
        <td align="center">

          <table width="100%" style="max-width:520px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.08);">

            <!-- 🔥 FRIENDSHIP BANNER -->
            <tr>
              <td style="
                background: linear-gradient(135deg, #25D366, #128C7E);
                padding:30px;
                text-align:center;
                color:white;
              ">
                
                <!-- Friendship SVG (2 people) -->
                <svg width="70" height="70" viewBox="0 0 24 24" fill="white">
                  <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11zM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.93 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>

                <h2 style="margin:10px 0 5px;">YaariChat</h2>
                <p style="margin:0; font-size:14px; opacity:0.9;">
                  Connecting friendships, one chat at a time 💚
                </p>

              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:30px; color:#333;">

                <p style="font-size:16px;">Hey 👋,</p>

                <p style="font-size:15px; color:#555;">
                  Your login code for <strong>YaariChat</strong> is below:
                </p>

                <!-- 💬 CHAT STYLE OTP -->
                <div style="margin:25px 0; text-align:center;">
                  <div style="
                    display:inline-block;
                    background:#dcf8c6;
                    padding:18px 30px;
                    border-radius:12px;
                    font-size:30px;
                    font-weight:bold;
                    letter-spacing:8px;
                    color:#075E54;
                    box-shadow:0 2px 6px rgba(0,0,0,0.1);
                  ">
                    ${otp}
                  </div>
                </div>

                <!-- INFO -->
                <div style="font-size:14px; color:#555; line-height:1.7;">
                  <p>⏳ Expires in <strong>5 minutes</strong></p>
                  <p>🔒 Keep this code private</p>
                  <p>If this wasn’t you, no worries — just ignore this message.</p>
                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="
                background:#f9f9f9;
                padding:20px;
                text-align:center;
                font-size:12px;
                color:#888;
              ">
                <p style="margin:0;">Made with 💚 for friendships</p>
                <p style="margin:5px 0 0;">© YaariChat</p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `;

  await transporter.sendMail({
    from : `YaariChatApp < ${process.env.EMAIL_USER}`,
    to : email,
    subject: 'Your YaariChat Verification Code',
    html,
  });

};


module.exports = sendOtpToEmail;