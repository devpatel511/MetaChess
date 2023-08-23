const http = require('http')
const { Server } = require('socket.io')
const express = require('express');
const cors = require ('cors');

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://fancy-lokum-132358.netlify.app/",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    socket.on("join_room", () => {
        var i = 1;
        while(io.sockets.adapter.rooms.get(`${i}`) !== undefined && io.sockets.adapter.rooms.get(`${i}`).size >= 2) {
            i++;
        }
        socket.join(`${i}`);
        if (io.sockets.adapter.rooms.get(`${i}`).size === 2) {
            var randomInt = Math.round(Math.random());
            io.sockets.adapter.rooms.get(`${i}`).forEach((socketId) => {
                io.to(socketId).emit("receive_message", { room: `${i}`, color: randomInt });
                randomInt = randomInt === 0 ? 1 : 0;
            })
        } 
    })

    socket.on("get_user", (data) => {
        io.sockets.adapter.rooms.get(data.room).forEach((socketId) => {
            if (socketId !== socket.id) {
                io.to(socketId).emit("foe_name", { name: data.name })
            }
        })
    })

    socket.on("move", (data) => {
        io.to(data.room).emit("move", { id: data.id, passant: data.passant, i: data.i, j: data.j, x: data.x, y: data.y, ret: data.ret });
    })

    socket.on("swap", (data) => {
        io.to(data.room).emit("swap", { id: data.id, name: data.name, i: data.i, j: data.j })
    })

    socket.on("disconnectMe", () => {
        socket.disconnect();
    })
})

server.listen(3002, () => console.log("Socket server started on port 3002"));
