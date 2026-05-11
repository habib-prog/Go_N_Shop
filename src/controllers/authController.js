const { signUpSchema } = require("../helpers/ZodValidators/validator");
const User = require("../models/userSchema");

const signUp = async (req, res) => {
  const parsed = signUpSchema.safeParse(req.body);
  try {
    //   Checking input data
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

    const user = await User.create({
      fullname,
      email,
      password,
      avatar,
      address,
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
    return res.status(500).json({ error: "Internal server Error" });
  }
};

const logIn = async (req, res) => {};

module.exports = { signUp, logIn };
