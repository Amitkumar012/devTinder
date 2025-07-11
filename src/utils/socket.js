
const socket = require("socket.io");
const crypto = require("crypto");
const {Chat} = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user")


const getSecretRoomId = (userId, targetUserId) => {
    return crypto
    .createHash('sha256')
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex")
}

const initializeSocket = (server) => {
    const io = socket(server, {
    cors: {
        origin: ["http://localhost:5173", "https://cunect.me"],
        credentials: true,
    },
    path: "/api/socket.io",
});

    io.on("connection", (socket)=>{
        console.log("Socket connected:", socket.id);
    console.log("Query data:", socket.handshake.query);
        // Handle events
        const userId = socket.handshake.query.userId;
        if (userId) {
            // User is online
            user.findByIdAndUpdate(userId, { isOnline: true }).exec();
            socket.broadcast.emit("userStatus", {
            userId,
            isOnline: true,
            lastSeen: null,
        });



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
                    }).populate({
                        path: "messages.senderId",
                        select: "firstName lastName",
                    })

                    // Check if userId & targetUserId are friends....

                    //ConnectionRequest.findOne({fromUserId: userId, toUserId: targetUserId, status: "accepted"})

                    if(!chat) {
                        chat = new Chat ({
                            participants: [userId, targetUserId],
                            messages: [],
                        });
                    }

                    const newMessage = {
                        senderId: userId,
                        text,
                        createdAt: new Date(),
                    };
                    chat.messages.push(newMessage);
                    

                    await chat.save();
                    io.to(roomId).emit("messageRecieved", {
                        firstName,
                        lastName,
                        text,
                        createdAt: newMessage.createdAt,
                        senderId: userId,
                    })

                }catch (err) {
                    console.log(err)
                }


        });
        socket.on("disconnect", async () =>{
            const lastSeen = new Date();
            console.log(`Disconnect received for ${userId} at ${lastSeen}`);

            const result = await user.findByIdAndUpdate(userId,{
                isOnline: false,
                lastSeen,

            });
            socket.broadcast.emit("userStatus", {
                userId,
                isOnline: false,
                lastSeen,
            })

            console.log(`User ${userId} disconnected.`);

        });
    }
    });
};

    
module.exports = initializeSocket;