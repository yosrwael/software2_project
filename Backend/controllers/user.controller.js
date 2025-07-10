const Users = require('../models/user')

const getUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Users.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

const createUser = async (req, res) => {
    try {
        const newUser = new Users({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobile: req.body.mobile,
            gender: req.body.gender,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
             confirmPassword:req.body.confirmPassword,
            isTest: req.body.isTest,
        });

        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Duplicate key error' });
        }
        res.status(500).json(error);
    }
};


const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const {
            firstName,
            lastName,
            mobile,
            gender,
            username,
            email,
            password,
            isAdmin ,
            confirmPassword,
        } = req.body;

        const updateFields = {};

        if (firstName !== undefined) updateFields.firstName = firstName;
        if (lastName !== undefined) updateFields.lastName = lastName;
        if (mobile !== undefined) updateFields.mobile = mobile;
        if (gender !== undefined) updateFields.gender = gender;
        if (username !== undefined) updateFields.username = username;
        if (email !== undefined) updateFields.email = email;
        if (password !== undefined) updateFields.password = password;
         if ( confirmPassword !== undefined) updateFields. confirmPassword=  confirmPassword ;
        if (typeof isAdmin === 'boolean') updateFields.isAdmin = isAdmin;

        const user = await Users.findByIdAndUpdate(
            { _id: userId },
            { $set: updateFields },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};



const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await Users.deleteOne({ _id: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json(error);
    }
};


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};