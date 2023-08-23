// const http = require('http')
// const { Server } = require('socket.io')
const express = require('express');
const mongoose = require('mongoose');
const cors = require ('cors');
const jsChessEngine = require('js-chess-engine')
const { aiMove } = jsChessEngine
require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors());

// const app2 = express();

// app2.use(cors());

// const server = http.createServer(app2);

// const io = new Server(server, {
//     cors: {
//         origin: "https://fancy-lokum-132358.netlify.app/",
//         methods: ["GET", "POST"],
//     },
// })

// io.on("connection", (socket) => {
//     socket.on("join_room", () => {
//         var i = 1;
//         while(io.sockets.adapter.rooms.get(`${i}`) !== undefined && io.sockets.adapter.rooms.get(`${i}`).size >= 2) {
//             i++;
//         }
//         socket.join(`${i}`);
//         if (io.sockets.adapter.rooms.get(`${i}`).size === 2) {
//             var randomInt = Math.round(Math.random());
//             io.sockets.adapter.rooms.get(`${i}`).forEach((socketId) => {
//                 io.to(socketId).emit("receive_message", { room: `${i}`, color: randomInt });
//                 randomInt = randomInt === 0 ? 1 : 0;
//             })
//         } 
//     })

//     socket.on("get_user", (data) => {
//         io.sockets.adapter.rooms.get(data.room).forEach((socketId) => {
//             if (socketId !== socket.id) {
//                 io.to(socketId).emit("foe_name", { name: data.name })
//             }
//         })
//     })

//     socket.on("move", (data) => {
//         io.to(data.room).emit("move", { id: data.id, passant: data.passant, i: data.i, j: data.j, x: data.x, y: data.y, ret: data.ret });
//     })

//     socket.on("swap", (data) => {
//         io.to(data.room).emit("swap", { id: data.id, name: data.name, i: data.i, j: data.j })
//     })

//     socket.on("disconnectMe", () => {
//         socket.disconnect();
//     })
// })

mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connect to DB"))
    .catch(console.error);

const Users = require('./user');

app.get('/user', async (req, res) => {
    const users = await Users.find().sort({ elo: -1 });

    res.json(users);
});

app.post('/user/elo', async (req, res) => {
    const user1 = await Users.findOne({ username: req.body.user1 }).exec();
    const user2 = await Users.findOne({ username: req.body.user2 }).exec();

    var user2Elo = null;
    if (user2 !== null) {
        user2Elo = user2.elo;
    }

    res.json({ user1: user1.elo, user2: user2Elo });
})

app.post('/game/computer', async (req, res) => {
    const fen = req.body.FEN;

    try {
        const move = aiMove(fen, 2);
        res.json(move);
    } catch (error) {
        res.json(null);
    }
})

app.post("/user/login", async (req, res) => {
    const username = req.body.username;
    const found = await Users.findOne({ username: username }).exec();
    if (found === null) {
        const user = new Users({
            username: req.body.username,
            password: req.body.password
        });
    
        user.save();
    
        res.json(user);
    } else if (found.password === req.body.password) {
        res.json({ username: "`" });
    } else {
        res.json({ username: "" });
    }
});

app.put("/game/online/:userId", async (req, res) => {
    const user = await Users.findOne({ username: req.params.userId }).exec();
    if (user !== null) {
        if (req.body.result === "W") {
            user.wins += 1
            user.elo += 50
        } else {
            user.losses += 1
            user.elo -= 50
            if (user.elo < 0) {
                user.elo = 0
            }
        }

        user.save();

        res.json(user);
    }
});

app.put("/game/computer/:userId", async (req, res) => {
    const user = await Users.findOne({ username: req.params.userId }).exec();
    if (user !== null && req.body.result === "W") {
        user.compWins += 1;
        user.elo += 100;
    } else {
        user.elo -= 100;
        if (user.elo < 0) {
            user.elo = 0;
        }
    }
    user.save();
    res.json(user);
});

app.listen(3001, () => console.log("DB server started on port 3001"));

// server.listen(3002, () => console.log("Socket server started on port 3002"));
