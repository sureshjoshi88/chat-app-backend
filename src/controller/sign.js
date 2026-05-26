const bcrypt = require("bcryptjs");
const authSchema = require("../moduel/auth");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check user exist
    const existingUser = await authSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const user = await authSchema.create({
      name,
      email,
      password: hashedPassword,
    });

  

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { signup };