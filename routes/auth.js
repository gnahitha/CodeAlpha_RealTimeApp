const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register Page
router.get("/register", (req, res) => {
    res.render("register");
});

// Login Page
router.get("/login", (req, res) => {
    res.render("login");
});

// Register User
router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({
            message: "Registration Successful"
        });

    } catch (error) {

        console.log(error);

        res.json({
            message: "Registration Failed"
        });

    }

});

// Login User
router.post("/login", async (req, res) => {

    try {

        console.log("Request Body:", req.body);

        const { email, password } = req.body;

        console.log("Email received:", email);

        const user = await User.findOne({ email });

        console.log("User found:", user);

        if (!user) {
            return res.json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        console.log(user);
        res.json({
            message: "Login Successful",
            token,
            username: user.name,
            email: user.email
        });

    } catch (error) {

        console.log(error);

        res.json({
            message: "Login Failed"
        });

    }

});

module.exports = router;