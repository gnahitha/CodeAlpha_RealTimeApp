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

// Socket.io
io.on("connection", (socket) => {

    console.log("New User Connected");
    socket.on("join-room", (data) => {

    socket.roomId = data.roomId;
    socket.username = data.username;
    socket.peerId = data.peerId;


    socket.join(data.roomId);


    if (!rooms[data.roomId]) {
        rooms[data.roomId] = [];
    }


    // Existing users
    socket.emit(
        "existing-users",
        rooms[data.roomId]
    );


    const user = {

        socketId: socket.id,
        peerId: data.peerId,
        username: data.username

    };


    // Add user
    rooms[data.roomId].push(user);


    // Notify others for WebRTC
    socket.to(data.roomId)
        .emit(
            "user-connected",
            user
        );


    // IMPORTANT: Send updated participant list
    io.to(data.roomId)
        .emit(
            "participants-update",
            rooms[data.roomId]
        );


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

            message: data.message

        });

    });
    
    socket.on("disconnect", () => {

    if (!socket.roomId) return;


    if (rooms[socket.roomId]) {


        rooms[socket.roomId] =
            rooms[socket.roomId].filter(user => {

                return user.socketId !== socket.id;

            });


        socket.to(socket.roomId)
            .emit("user-disconnected", {

                socketId: socket.id,
                peerId: socket.peerId

            });


        // Update everyone
        io.to(socket.roomId)
            .emit(
                "participants-update",
                rooms[socket.roomId]
            );


        if (rooms[socket.roomId].length === 0) {

            delete rooms[socket.roomId];

        }

    }

});
});

// Start Server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});