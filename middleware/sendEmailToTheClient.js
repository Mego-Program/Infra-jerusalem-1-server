import nodemailer from "nodemailer";

async function sendEmail(email,code) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "megoinfrajerusalem1@gmail.com",
        pass: process.env.PASSWORD_EMAIL,
      },
    });

    const mailOptions = {
      from: "megoinfrajerusalem1@gmail.com",
      to: email,
      subject: "Code",
      text: 'The code is ' + code,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

export default sendEmail;
