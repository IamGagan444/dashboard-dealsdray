import { AsyncHandler } from "../utils/AsyncHandler.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";

// Superadmin, Admin, Superuser can create other users
export const createUser = AsyncHandler(async (req, res, next) => {
  const { username, password, role, email } = req.body;
  

  const emptyFields = ["username", "password", "role", "email"];

  const isEmptyFields = emptyFields.filter((field) => !req.body[field]?.trim());
  

  if (isEmptyFields.length > 0) {
    return next(
      new ApiError(
        400,
        `${isEmptyFields.join(", ")} ${isEmptyFields.length > 1 ? "are" : "is"} required`,
      ),
    );
  }

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    return next(new ApiError(400, "Email already registered"));
  }

  // Role validation
  if (
    req.user.role === "superAdmin" &&
    ["admin", "superUser", "user"].includes(role)
  ) {
    // Superadmin can create Admin, Superuser, and User
  } else if (
    req.user.role === "admin" &&
    ["superUser", "user"].includes(role)
  ) {
    // Admin can create Superuser and User
  } else if (req.user.role === "superUser" && role === "user") {
    // Superuser can only create User
  } else {
    return next(
      new ApiError(403, "you are not allowed to create this Role gg"),
    );
  }

  // Create user

  const newUser = new User({
    username,
    email,
    password,
    role,
    createdBy: req.user.id,
  });

  await newUser.save();
  return res
    .status(201)
    .json(
      new Apiresponse(
        201,
        newUser,
        `${req.user.role}  has been created ${role}`,
      ),
    );
});

//update user details
export const updateUserDetails = AsyncHandler(async (req, res, next) => {
  const { username, email, password, gender, phoneNo } = req.body;
  const profile = req.file;
  const { userId } = req.params;


  // Required fields
  const fields = ["username", "email", "password", "gender", "phoneNo"];


  if (!profile) {
    return next(new ApiError(400, "Profile is required"));
  }

  const isEmptyField = fields.filter((field) => !req.body[field]?.trim()); // Checks for empty values
  if (isEmptyField.length > 0) {
    return next(
      new ApiError(
        400,
        `${isEmptyField.join(", ")} ${isEmptyField.length > 1 ? "are" : "is"} required!`,
      ),
    );
  }

  const profileUrl = await uploadOnCloudinary(profile?.path);

  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(400, "User not found"));
  }
  user.username = username || user.username;
  user.email = email || user.email;
  user.password = password || user.password;
  user.gender = gender || user.gender;
  user.phoneNo = phoneNo || user.phoneNo;
  user.profile = profileUrl?.url || user.profile;

  await user.save();

  return res
    .status(201)
    .json(new Apiresponse(201, user, "User details updated successfully"));


});

export const deleteUser=AsyncHandler(async(req,res,next)=>{
  const {userId}=req.params;
console.log(userId);
  if(!userId)
  {
    return next(new ApiError(400, "User not found"));
  }
  const user=await User.findByIdAndDelete(userId);
  return res
    .status(201)
    .json(new Apiresponse(201, user, "User deleted successfully"));
})

// Get all users (Superadmin only)
export const getAllUsers = AsyncHandler(async (req, res, next) => {
  let users;
  if (req.user.role === "hr") {
    users = await User.find();
  } else {
    users = await User.find({ createdBy: req.user._id });
  }
  if (!users) {
    return next(new ApiError(400, "No users found"));
  }
  return res
    .status(200)
    .json(
      new Apiresponse(
        201,
        { users, me: req.user },
        "users data fetched successfully",
      ),
    );
});

// hr gets users they created
export const getCreatedUsers = AsyncHandler(async (req, res, next) => {
  const users = await User.find({ createdBy: req.user._id });
  if (!users) {
    return next(new ApiError(400, "No users found"));
  }
  return res
    .status(200)
    .json(
      new Apiresponse(
        201,
        { users, me: req.user },
        "users data fetched successfully",
      ),
    );
});
