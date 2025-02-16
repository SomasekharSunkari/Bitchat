import express from "express";
import protect from "../middelwares/authMiddelware.js"
import { allMessages, sendMessage } from "../controllers/messageController.js"
const messageRouter = express.Router();


messageRouter.route("/:chatId").get(protect, allMessages);
messageRouter.route("/").post(protect, sendMessage);



export default messageRouter;