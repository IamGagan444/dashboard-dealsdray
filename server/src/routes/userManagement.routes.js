import { Router } from "express";

import {
  createUser,
  deleteUser,
  getAllUsers,
  getCreatedUsers,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/create-user")
  .post(authMiddleware(["hr", "manager", "sales"]), upload.none(), createUser);
router
  .route("/get-all-users")
  .get(authMiddleware(["hr", "manager", "sales"]), getAllUsers);
router
  .route("/update-user/:userId")
  .post(upload.single("profile"), updateUserDetails);

  router.route("/delete-user/:userId").delete(deleteUser);


export default router;
