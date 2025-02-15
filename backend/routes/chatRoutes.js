import express from "express"
import protect from "../middelwares/authMiddelware.js";
import { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } from "../controllers/chatController.js";

const chatRouter = express.Router();
chatRouter.post("/", protect, accessChat);
chatRouter.get("/", protect, fetchChats);
chatRouter.route("/group").post(protect, createGroupChat);
chatRouter.route("/rename").put(protect, renameGroup);
chatRouter.route("/groupremove").put(protect, removeFromGroup);
chatRouter.route("/groupadd").put(protect, addToGroup);

export default chatRouter;