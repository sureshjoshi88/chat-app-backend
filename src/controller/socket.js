const message = require("../moduel/message");

const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("user connected", socket.id);

    // old messages
    const messages = await message.find().sort({ createdAt: 1 });
    socket.emit("load_messages", messages);

    // new message
    socket.on("send_message", async (data) => {
      try {
        const newMessage = new message(data);
        await newMessage.save();

        io.emit("receive_message", newMessage);
      } catch (error) {
        console.log("Save error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = socketHandler;