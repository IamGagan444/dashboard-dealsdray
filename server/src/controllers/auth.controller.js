import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";

const userRegistration = AsyncHandler(async (req, res, next) => {
  const { username, email, password, gender, phoneNo } = req.body;
  console.log(req.body)
  const profile = req.file; // The uploaded file will be in req.file

  console.log("profile:", profile); // This should log the file object

  // Required fields
  const fields = ["username", "email", "password", "gender", "phoneNo"];

  if (!profile) {
    return next(new ApiError(400, "Profile is required"));
  }

  const isEmptyField = fields.filter((field) => !req.body[field]?.trim());
  if (isEmptyField.length > 0) {
    return next(
      new ApiError(
        400,
        `${isEmptyField.join(", ")} ${isEmptyField.length > 1 ? "are" : "is"} required!`
      )
    );
  }

  const isSuperAdminExist = await User.findOne({ role: "hr" });
  const userRole = !isSuperAdminExist ? "hr" : "sales";

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return next(new ApiError(401, "Email has already been registered"));
  }

  // Upload profile to Cloudinary or use the file path as needed
  const profilePath = await uploadOnCloudinary(profile.path);

  // Create the new user
  const user = await User.create({
    username,
    email,
    password,
    role: userRole,
    createdBy: req.user ? req.user.id : null,
    gender,
    phoneNo,
    profile: profilePath, // Storing the uploaded file URL from Cloudinary
  });

  // Return created user without password
  const data = await User.findById(user._id).select("-password");

  return res.status(201).json(new Apiresponse(201, data, "User registered successfully"));
});


const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }
};

const userLogin = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "email and password are required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ApiError(404, "user not found"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return next(new ApiError(401, "invalid password"));
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const options = {
    httpOnly: true,
    Secure: true, //Secure, S should be capital
    // sameSite: "None",
    path: "/", //you can access anywhere
    maxAge: 1000 * 60 * 60 * 24 * 1,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new Apiresponse(
        200,
        {
          users: user,
          accessToken,
          refreshToken,
        },
        "user loggedin successfully",
      ),
    );
});

export { userRegistration, userLogin };
