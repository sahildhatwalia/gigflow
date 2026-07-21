import dotenv from "dotenv";
dotenv.config();

import sendOTP from "./utils/sendOTP.js";

sendOTP(
  "sahildhatwalia04@gmail.com",
  "123456"
)
  .then(() => {
    console.log("Mail Sent");
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });