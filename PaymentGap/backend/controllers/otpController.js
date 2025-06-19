import nodemailer from 'nodemailer';
import { getUserByUsernameAndPassword } from '../models/authModel.js';
import { saveOtp, getOtp, deleteOtp } from '../models/OTPModel.js';


// Functie pentru generare cod random de 6 cifre
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Trimite codul pe email folosind nodemailer
async function sendEmailOTP(to, otp) {
  let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "gabriela.spiridon2003@gmail.com",
    pass: "vjvw dnjy gdtj bfzj", // app password, corect!
  },
  tls: {
    rejectUnauthorized: false
  }
});

  await transporter.sendMail({
    from: '"Payment Gap" <gabriela.spiridon2003@gmail.com>',
    to,
    subject: "Authentication Code",
    text: `Your authentication code is: ${otp}`,
  });
}

// Endpoint pentru login cu generare si trimitere OTP
export async function loginWith2FA(req, res) {
  const { username, password } = req.body;
  const user = await getUserByUsernameAndPassword(username, password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const otp = generateOTP();
  const expires = new Date(Date.now() + 3 * 60 * 1000); // 3 minute
  await saveOtp(username, otp, expires);
  await sendEmailOTP(username, otp);
  res.json({ success: true, step: "otp" });
}

// Endpoint pentru verificare OTP
export async function verifyOTP(req, res) {
  const { username, code } = req.body;
  const otpData = await getOtp(username);
  if (!otpData) {
    return res.status(400).json({ success: false, message: "Code doesn't exist" });
  }
  if (new Date(otpData.expires_at) < new Date()) {
    await deleteOtp(username);
    return res.status(400).json({ success: false, message: "Code expired" });
  }
  if (otpData.code !== code) {
    return res.status(400).json({ success: false, message: "Code incorrect" });
  }
  await deleteOtp(username);
  res.json({ success: true, userId: username }); 
}
