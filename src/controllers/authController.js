const mailService = require("../helpers/Mail/mailService");
const generateSecureOTP = require("../helpers/Otp/otp");
const template = require("../helpers/Template/mailTemp");
const { signUpSchema } = require("../helpers/ZodValidators/validator");
const User = require("../models/userSchema");

const signUp = async (req, res) => {
  const parsed = signUpSchema.safeParse(req.body);
  try {
    //   Checking input data Using ZOD
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation Failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { fullname, email, password, avatar, address } = parsed.data;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(409).json({ error: "user already exist" });
    // Generate OTP
    const OtpCode = generateSecureOTP();

    //  otp expiry time

    const expireAfter = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      fullname,
      email,
      password,
      avatar,
      address,
      otp: OtpCode,
      otpExp: expireAfter,
    });
    await mailService({
      email,
      otp: OtpCode,
      msg: "Verify OTP to Sign Up",
      sub: "Go N Shop Email Verification",
      template: template(
        OtpCode,
        "Verify OTP to Sign Up",
        "Go N Shop Email Verification",
      ),
    });
    return res.status(201).json({
      message: "Sign Up successfull",
      user: {
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Sign up failed:", error);
    return res.status(500).json({ error: "Internal server Error" });
  }
};

const logIn = async (req, res) => {};

module.exports = { signUp, logIn };
