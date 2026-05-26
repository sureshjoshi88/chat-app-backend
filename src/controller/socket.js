const message = require("../moduel/message");
const users = {};
const onlineUsers = {};

const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("user connected", socket.id);

    socket.on("register", (userId) => {
      users[userId] = socket.id;
      onlineUsers[userId] = true;
      io.emit("online_users", Object.keys(onlineUsers));
    });

    // old messages
    socket.on("load_private_messages", async ({ senderId, receiverId }) => {

      const messages = await message.find({
        $or: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      }).sort({ createdAt: 1 });

      socket.emit("load_messages", messages);
    });



    // message seen

    socket.on("message_seen", async ({ messageId, senderId }) => {
      await message.findByIdAndUpdate(
        messageId,
        {
          seen: true
        }
      );

      const senderSocketId = users[senderId];

      if (senderSocketId) {

        io.to(senderSocketId).emit(
          "message_seen_update",
          messageId
        );

      }

    });



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
      } catch (error) {
        console.log("Save error:", error);
      }
    });

    socket.on("typing", ({ username, receiverId }) => {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", username);
      }
    });

    socket.on("stop_typing", (receiverId) => {
      const receiverSocketId = users[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_stop_typing");
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          delete onlineUsers[userId];
        }
      }

      io.emit("online_users", Object.keys(onlineUsers));
    });
  });
};

module.exports = socketHandler;


