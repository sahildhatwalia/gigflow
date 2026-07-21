import sendEmail from "./sendEmail.js";

const sendOTP = async (email, otp) => {
  const html = `
    <div style="font-family:Arial,sans-serif;padding:30px;background:#f8fafc">
      <div style="max-width:500px;margin:auto;background:white;border-radius:12px;padding:30px">

        <h2 style="color:#4f46e5;margin-bottom:20px">
          HyperCRUD Email Verification
        </h2>

        <p>Hello,</p>

        <p>
          Use the OTP below to verify your email address.
        </p>

        <div
          style="
            margin:30px 0;
            text-align:center;
            font-size:34px;
            font-weight:bold;
            letter-spacing:8px;
            color:#4f46e5;
          "
        >
          ${otp}
        </div>

        <p>
          This OTP is valid for
          <strong>10 minutes</strong>.
        </p>

        <p style="color:#64748b;font-size:14px">
          If you didn't request this verification,
          you can safely ignore this email.
        </p>

        <hr style="margin:25px 0">

        <p style="font-size:13px;color:#94a3b8">
          © HyperCRUD Inventory Management
        </p>

      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Verify Your Email - HyperCRUD",
    html,
  });
};

export default sendOTP;