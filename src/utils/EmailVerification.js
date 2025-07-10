

const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const UserVerification = require("../models/UserVerification");

require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) console.error("Email transport error:", error);
  else console.log("Ready for messages");
});

// Send verification email
const sendVerificationEmail = async ({ _id, emailId }) => {
  


  const uniqueString = uuidv4() + _id;
  const verificationLink = `http://13.201.122.87:7777/verify/${_id}/${uniqueString}`;
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: emailId,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete signup.</p>
           <p>This link expires in 6 hours.</p>
           <p>Click <a href="${verificationLink}">Click here to verify your email</a>
           to verify.</p>`,
  };

  try {
    const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
    const newVerification = new UserVerification({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 6 * 60 * 60 * 1000, // 6 hours
    });

    await newVerification.save();
    await transporter.sendMail(mailOptions);
    return { status: "PENDING", message: "Verification email sent" };
  } catch (error) {
    console.error("sendVerificationEmail error:", error);
    return { status: "FAILED", message: "Email verification failed" };
  }
};

module.exports = { sendVerificationEmail };

