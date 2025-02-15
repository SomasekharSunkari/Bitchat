import express from "express"
import { chats } from "./data/data.js"
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middelwares/errorMiddelware.js";
import cors from "cors"
import router from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import connection from "./config/db_config.js";
const app = express();
dotenv.config()
connection()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173"
    ,
    methods: ["GET", "POST", "DELETE", "PUT"]
}))
app.use("/api/user", router)
app.use("/api/chat", chatRouter);
app.get("/", (req, res) => {
    res.send("API IS RUNNING")
})
app.get("/api/chats", (req, res) => {
    res.send(chats)
})
app.get("/api/chats/:id", (req, res) => {
    const { id } = req.params;
    const reqChat = chats.find((c) => c._id === id)
    res.send(reqChat);
})
app.use(notFound); //This runs when no other routes matched
app.use(errorHandler); //Passes all the values to this error handeler at the end

app.listen(process.env.PORT, () => {
    console.log(`Server Started On Port ${process.env.PORT}!`)
})