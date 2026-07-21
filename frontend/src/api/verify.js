import api from "./axios";

const verifyApi = {

  verifyEmail: (data) =>
    api.post("/verify/email", data),

  resendOTP: (data) =>
    api.post("/verify/resend", data),

};

export default verifyApi;