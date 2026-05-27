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

socketHandler(io);

app.use("/api/v1", router);


app.get("/", (req, res) => {
    console.log("hy");
    res.send(" app is running")
})
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);

})