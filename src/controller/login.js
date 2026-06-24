const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authSchema = require("../moduel/auth");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // check user exist
        const isMatch = await authSchema.findOne({ email });
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // hash password
        const comparePassword = await bcrypt.compare(password, isMatch.password);
        if (!comparePassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }


        // token generate
        const token = jwt.sign(
            { id: isMatch._id, name: isMatch.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "User login successfully",
            token,
            user: {
                _id: isMatch._id,
                name: isMatch.name,
                email: isMatch.email,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
        });
    }
};


const getAllUser = async (req, res) => {

    try {
        const user = await authSchema.find().lean();
        res.status(200).json({ success: true, message: "user fetch", user })
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
}

module.exports = { login, getAllUser };