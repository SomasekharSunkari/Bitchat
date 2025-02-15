import express from "express"
import { registerUser, authUser, allUsers } from "../controllers/userController.js";
import protect from "../middelwares/authMiddelware.js";
const router = express.Router();
router.get("/", protect, allUsers)
router.route("/").post(registerUser);
router.post("/login", authUser);

export default router;