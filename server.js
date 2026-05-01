const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./src/config/db");
// const message = require("./src/moduel/message");
const socketHandler = require("./src/controller/socket");
const router = require("./src/routes/route");
require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json()); // IMPORTANT


const server = http.createServer(app);

connectDB()

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

// io.on("connection", async(socket) => {
//     console.log("user connected", socket.id);

//     const messages = await message.find().sort({ createdAt: 1 });
//     socket.emit("load_messages", messages);

//     socket.on("send_message", async (data) => {
//         // console.log("message:", data);
//         try {
//             // DB me save
//             const newMessage = new message(data);
//             await newMessage.save();

//             // sabko bhejo
//             io.emit("receive_message", newMessage);

//         } catch (error) {
//             console.log("Save error:", error);
//         }
//         // io.emit("receive_message", data);
//     });

//     socket.on("disconnect", () => {
//         console.log("user disconnected");
//     });
// });


socketHandler(io);

app.use("/api", router);


app.get("/", (req, res) => {
    console.log("hy");
    res.send("running")
})
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);

})