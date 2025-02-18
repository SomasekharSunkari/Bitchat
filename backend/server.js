import express from "express"
import { chats } from "./data/data.js"
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middelwares/errorMiddelware.js";
import cors from "cors"
import router from "./routes/userRoutes.js";
import { Server } from "socket.io"
import chatRouter from "./routes/chatRoutes.js";
import connection from "./config/db_config.js";
import path from "path"
import messageRouter from "./routes/messageRoutes.js";
const app = express();
dotenv.config()
connection()
app.use(express.json())
app.use(cors({}))
app.use("/api/user", router)
app.use("/api/chat", chatRouter);
app.use("/api/messages", messageRouter)
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "../frontend/dist")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}
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
app.use(notFound); //This runs when no other routes matchedcns
app.use(errorHandler); //Passes all the values to this error handeler at the end
const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started On Port ${process.env.PORT}!`)
})

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on("connection", (socket) => {
    console.log("Connected to  socket.io")
    socket.on("setup", (userData) => {
        console.log(socket.id)

        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User Joined room + " + room)
    })
    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    });
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("Message recieved", newMessageRecieved);
        });
    });
    socket.off("setup", () => {
        console.log("Socket Left")
        socket.leave(userData._id)
    })
})