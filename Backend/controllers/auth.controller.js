const bcrypt = require("bcrypt");
const Users = require("../models/user");
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { firstName, lastName, mobile, gender, username, email, password, confirmPassword, isAdmin, isTest } = req.body;

    if (!firstName || !lastName || !mobile || !gender || !username || !email || !password || !confirmPassword) {
        return res.redirect('/register?error=Missing+required+fields');
    }

    if (password !== confirmPassword) {
        return res.redirect('/register?error=Passwords+do+not+match');
    }

    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
        return res.redirect('/register?error=User+already+exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({
        firstName, lastName, mobile, gender, username, email, password: hashedPassword,  confirmPassword ,isAdmin, isTest
    });

    await newUser.save();
    req.session.user = newUser;
    res.redirect("/home");
};


const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await Users.findOne({ email: email });
    if (!user) {
        return res.redirect('/login?error=Invalid+email+or+password');
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
        return res.redirect('/login?error=Invalid+email+or+password');
    }

    req.session.user = user;
    res.redirect("/home");
};

const logout = async (req, res) => {
    req.session.destroy();
    res.redirect("/login");
};

module.exports = {
    register,
    login,
    logout,
}