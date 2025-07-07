
const socket = require("socket.io");
const crypto = require("crypto");
const {Chat} = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex")
}

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    })

    io.on("connection", (socket)=>{
        // Handle events

        socket.on("joinChat", ({ firstName, userId, targetUserId})=>{
            const roomId = getSecretRoomId(userId, targetUserId)
            console.log(firstName + "Joining Room: " + roomId)
            socket.join(roomId)
        });

        socket.on("sendMessage", async ({ firstName , lastName, userId, targetUserId, text})=>{
           
                //Save message to the Database
                try{
                    const roomId = getSecretRoomId(userId, targetUserId)
                    console.log(firstName + " " + text)

                    let chat = await Chat.findOne({
                        participants: { $all: [userId, targetUserId]},
                    })

                    // Check if userId & targetUserId are friends....

                    //ConnectionRequest.findOne({fromUserId: userId, toUserId: targetUserId, status: "accepted"})

                    if(!chat) {
                        chat = new Chat ({
                            participants: [userId, targetUserId],
                            messages: [],
                        });
                    }

                    chat.messages.push({
                        senderId: userId,
                        text,
                    });

                    await chat.save();
                    io.to(roomId).emit("messageRecieved", { firstName, lastName ,text })

                }catch (err) {
                    console.log(err)
                }


        });
        socket.on("disconnect", () =>{
    });
})

}

module.exports = initializeSocket;