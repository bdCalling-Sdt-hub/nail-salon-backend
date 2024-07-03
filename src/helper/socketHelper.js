const Message = require("../app/modules/message/message.model");

const socketHandler  = (io) => {
    io.on("connection", (socket) => {
        console.log("A user connected");

        socket.on("joinChat", (conversationId) => {
            socket.join(conversationId);
        });
      
          //send and get message
        socket.on("sendMessage", async (payload)=> {
            
            const { conversationId, sender, message }= payload;
            // save to DB
            const messageData = {
                conversationId: conversationId,
                sender: sender,
                message: message
            };
            
            const response = await Message.create(messageData);
            io.to(conversationId).emit("getMessage", response);

        });

        //disconnect socket
        socket.on("disconnect", () => {
            console.log("A user disconnect");
        });
    });
};
module.exports=socketHandler;