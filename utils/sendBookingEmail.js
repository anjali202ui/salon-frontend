const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🔹 Verify transporter (IMPORTANT)
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter error ❌", error);
  } else {
    console.log("EMAIL USER: Loaded ✅");
  }
});

// =======================
// CONFIRM EMAIL
// =======================
const sendConfirmEmail = async (to, booking) => {
  try {
    const mailOptions = {
      from: `"Blossom Beauty Salon" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your Salon Appointment is Confirmed 💇‍♀️",
      html: `
        <h2>Appointment Confirmed 🎉</h2>
        <p>Hello <b>${booking.name}</b>,</p>
        <p>Your appointment has been <b>confirmed</b>.</p>

        <p><b>Service:</b> ${booking.serviceName || booking.service}</p>
        <p><b>Date:</b> ${booking.date}</p>
        <p><b>Time:</b> ${booking.time}</p>

        <br/>
        <p>Thank you for choosing Blossom Beauty Salon 💖</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirm email sent ✅ to", to);

  } catch (error) {
    console.error("Confirm email failed ❌", error);
  }
};

// =======================
// CANCEL EMAIL
// =======================
const sendCancelEmail = async (to, booking) => {
  try {
    const mailOptions = {
      from: `"Blossom Beauty Salon" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your Salon Appointment is Cancelled ❌",
      html: `
        <h2>Appointment Cancelled</h2>
        <p>Hello <b>${booking.name}</b>,</p>
        <p>Your appointment has been cancelled.</p>

        <p><b>Service:</b> ${booking.serviceName || booking.service}</p>
        <p><b>Date:</b> ${booking.date}</p>
        <p><b>Time:</b> ${booking.time}</p>

        <br/>
        <p>If you have questions, please contact us.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Cancel email sent ✅ to", to);

  } catch (error) {
    console.error("Cancel email failed ❌", error);
  }
};

module.exports = { sendConfirmEmail, sendCancelEmail };
