const socket = io();

const peer = new Peer(undefined, {
    host: window.location.hostname,
    port: window.location.port,
    path: "/peerjs"
});

const peers = {};
window.peers = peers;

const username = localStorage.getItem("username") || "Guest";

let myPeerId = "";

// --------------------
// Join Room
// --------------------
peer.on("open", (id) => {

    myPeerId = id;

    socket.emit("join-room", {
        roomId: ROOM_ID,
        username: username,
        peerId: id
    });

});

// --------------------
// Existing Users
// --------------------
socket.on("existing-users", (users) => {

    users.forEach(user => {

        connectToNewUser(user.peerId, user.username);

    });

});

// --------------------
// New User Joined
// --------------------
socket.on("user-connected", (user) => {

    connectToNewUser(user.peerId, user.username);

    //addParticipant(user.socketId, user.username);

});

// --------------------
// User Left
// --------------------
socket.on("user-disconnected", (user) => {

    if (peers[user.peerId]) {

        peers[user.peerId].close();

        delete peers[user.peerId];

    }

    //const participant = document.getElementById(user.socketId);

   // if (participant) {

       // participant.remove();

    //}

});
socket.on("participants-update", (users)=>{

    updateParticipants(users);

});
// --------------------
// Connect To User
// --------------------
function connectToNewUser(peerId, username) {

    if (!window.myStream) return;

    if (peers[peerId]) return;

    const call = peer.call(peerId, window.myStream);

    peers[peerId] = call;

    const video = document.createElement("video");

    video.autoplay = true;

    video.playsInline = true;

    call.on("stream", (userVideoStream) => {

        window.addVideoStream(video, userVideoStream, username);

    });

    call.on("close", () => {

        video.parentElement?.remove();

        delete peers[peerId];

    });

}

// --------------------
// Participants
// --------------------
const participants = document.getElementById("participants");

const participantCount = document.getElementById("participantCount");
function updateParticipants(users) {

    participants.innerHTML = "";

    users.forEach(user => {

        const div = document.createElement("div");

        div.className = "participant";

        div.id = user.socketId;

        div.innerHTML = `
            <i class="fa-solid fa-user"></i>
            <span>${user.username}</span>
        `;

        participants.appendChild(div);

    });


    participantCount.innerText = users.length;

}
// --------------------
// My Name
// --------------------
const myName = document.getElementById("myName");

if (myName) {

    myName.textContent = username;

}