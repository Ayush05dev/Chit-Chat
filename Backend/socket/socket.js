const {Server} = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{// as socket gives cors error so we pass the domain of frontend
        origin:["http://localhost:3000"],
        // origin:["https://chit-chat-s2op.onrender.com/"], here no need to change 
        methods:["GET","POST"]
    }
});

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

const userSocketMap = {};  // {userId:socketId} // this map store users which are connected to socket (or which are online) -> use in frontend to show who are online

io.on('connection',(socket)=>{
    console.log('a user connected',socket.id);

    const userId=socket.handshake.query.userId;
    if(userId!="undefined"){
        userSocketMap[userId]=socket.id;
    }

    // io.emit() is used to emit the events to all the connected clients
    // so when users connect it will send the info about no. of users online 
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    // socket.on() is used to listen to the events , can be used both on client and server side 
    socket.on("disconnect",()=>{
        console.log("user diconnected",socket.id);
        delete userSocketMap[userId]; 
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
});


module.exports={app,io,server,getReceiverSocketId};