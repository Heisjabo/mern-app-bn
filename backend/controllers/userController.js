import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from "../utils/generateToken.js";
import jwt from 'jsonwebtoken';

// Auth user/set token
// route POST /api/users/auth

const authUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        email: "invalid email",
      });
    }

    if (user.password !== req.body.password) {
      return res.status(401).json({
        status: "fail",
        email: "incorrect email and password",
      });
    }

    return res.status(200).json({
      token: await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      }),
      status: "success",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

// Register user
// route POST /api/users

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({email: req.body.email});

    if(userExist){
        return res.status(409).json({
          status: "fail",
          message: "Email has been taken by other user",
        });
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(400).json({ message: error.message });
    }

};

// Logout user
// route POST /api/users/logout

const logOutUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Logout User" });
});

// Get user profile
// route GET /api/users/profile

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw Error("User not found");
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get user profile
// route GET /api/users/profile

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) throw Error("User not found");
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
    authUser,
    registerUser,
    logOutUser,
    getUserProfile,
    updateUserProfile,
    getUsers
};