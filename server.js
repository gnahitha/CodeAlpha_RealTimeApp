const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const dotenv = require("dotenv");

const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");
const { ExpressPeerServer } = require("peer");
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.use("/peerjs", peerServer);

const io = new Server(server);
const rooms = {};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");

// Routes
app.use("/", authRoutes);

// Home Page
app.get("/", (req, res) => {
    res.render("index");
});

// Meeting Home
app.get("/room", (req, res) => {
    res.render("room");
});

// Join Meeting
app.get("/room/:roomId", (req, res) => {
    res.render("room", {
        roomId: req.params.roomId
    });
});

function leaveRoom(socket) {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) {
        socket.roomId = null;
        socket.joined = false;
        return;
    }

    const socketId = socket.id;
    const peerId = socket.peerId;
    const existed = rooms[roomId].some((user) => user.socketId === socketId);

    if (!existed) {
        socket.roomId = null;
        socket.joined = false;
        return;
    }

    rooms[roomId] = rooms[roomId].filter((user) => {
        return user.socketId !== socketId;
    });

    socket.to(roomId).emit("user-disconnected", {
        socketId,
        peerId
    });

    io.to(roomId).emit("participants-update", rooms[roomId]);

    if (rooms[roomId].length === 0) {
        delete rooms[roomId];
    }

    socket.leave(roomId);
    socket.roomId = null;
    socket.joined = false;
}

// Socket.io
io.on("connection", (socket) => {

    console.log("New User Connected");

    socket.on("join-room", (data) => {
        if (!data || !data.roomId || !data.peerId) return;
        if (socket.joined && socket.roomId === data.roomId) return;

        if (socket.joined) {
            leaveRoom(socket);
        }

        socket.roomId = data.roomId;
        socket.username = data.username;
        socket.peerId = data.peerId;
        socket.joined = true;

        socket.join(data.roomId);

        if (!rooms[data.roomId]) {
            rooms[data.roomId] = [];
        }

        socket.emit("existing-users", rooms[data.roomId]);

        const user = {
            socketId: socket.id,
            peerId: data.peerId,
            username: data.username,
            cameraOn: true,
            micOn: true
        };

        rooms[data.roomId].push(user);

        socket.to(data.roomId).emit("user-connected", user);

        io.to(data.roomId).emit("participants-update", rooms[data.roomId]);
    });

    socket.on("media-state", (data) => {
        if (!socket.roomId || !rooms[socket.roomId] || !data) return;

        const user = rooms[socket.roomId].find((entry) => {
            return entry.socketId === socket.id;
        });

        if (user) {
            user.cameraOn = data.cameraOn !== false;
            user.micOn = data.micOn !== false;
        }

        socket.to(socket.roomId).emit("media-state", {
            peerId: socket.peerId,
            cameraOn: data.cameraOn !== false,
            micOn: data.micOn !== false
        });
    });

    socket.on("leave-room", () => {
        leaveRoom(socket);
    });

    socket.on("draw", (data) => {
        socket.to(data.roomId).emit("draw", data);
    });

    socket.on("clear-board", (roomId) => {
        socket.to(roomId).emit("clear-board");
    });

    socket.on("chat-message", (data) => {
        io.to(data.roomId).emit("receive-message", {
            sender: data.sender,
            message: data.message,
            socketId: socket.id
        });
    });

    socket.on("disconnect", () => {
        leaveRoom(socket);
    });

});

// Start Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});