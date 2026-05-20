const message = require("../moduel/message");

const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("user connected", socket.id);

    socket.on("register", (userId) => {
      users[userId] = socket.id;
    });

    // old messages
    const messages = await message.find().sort({ createdAt: 1 });
    socket.emit("load_messages", messages);

    // new message
    socket.on("send_message", async (data) => {
      try {
        if (!data.text || data.text.trim() === "") return;

        const newMessage = new message({
          text: data.text,
          senderId: data.senderId,
          receiverId: data.receiverId,
          user: data.user,
        });
        await newMessage.save();

        const receiverSocketId = users[data.receiverId];

        socket.emit("receive_message", newMessage);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "receive_message",
            newMessage
          );
        }

        // io.emit("receive_message", newMessage);
      } catch (error) {
        console.log("Save error:", error);
      }
    });

    socket.on("typing", (username) => {
      socket.broadcast.emit("user_typing", username);
    });

    socket.on("stop_typing", () => {
      socket.broadcast.emit("user_stop_typing");
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      //  for (let userId in users) {
      //   if (users[userId] === socket.id) {
      //     delete users[userId];
      //   }
      // }
    });
  });
};

module.exports = socketHandler;