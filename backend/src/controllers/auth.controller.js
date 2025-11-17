import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { success } from "zod";
import Role from "../models/Role.js";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "../../../shared/validations/user.validation.js";

export const signup = async (req, res) => {
  try {
    //validating using zod
    const validation = signupValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      profilePic,
      roleName,
    } = validation.data;

    //checking for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });

    const role = await Role.findOne({ roleName });
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "invalid role",
      });
    }
    const roleId = role._id;

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      profilePic,
      roleId,
    });

    //saving new user
    const savedUser = await newUser.save();

    // //generating jwt token
    // generateToken(savedUser._id, res);

    res.status(201).json({
      success: true,
      message: "User Created successfully",
    });
  } catch (error) {
    console.log("Error in signup Controller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const validation = loginValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email }).populate("roleId");
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "Welcome " + user.firstName + " " + user.lastName,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePic: user.profilePic,
        roleName: user.roleId.roleName,
      },
    });
  } catch (error) {
    console.log("Error in login auth.contoller", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ success: true, message: "logged out successfully" });
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("roleId");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePic: user.profilePic,
        roleName: user.roleId.roleName,
      },
    });
  } catch (error) {
    console.log("Error in checkAuth:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    console.log("Error in update profile", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
