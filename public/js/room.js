const socket = io();

const peers = {};
window.peers = peers;

const userNames = {};
const mediaStates = {};

const username = localStorage.getItem("username") || "Guest";

let myPeerId = "";
let hasJoinedRoom = false;
let peer = null;

window.myPeerId = "";

const myName = document.getElementById("myName");
if (myName) {
    myName.textContent = username;
}

const avatarLetter = document.getElementById("avatarLetter");
const avatarName = document.getElementById("avatarName");
if (avatarLetter) {
    avatarLetter.textContent = username.charAt(0).toUpperCase();
}
if (avatarName) {
    avatarName.textContent = username;
}

function rememberUser(peerId, name) {
    if (peerId && name) {
        userNames[peerId] = name;
    }
}

function getUsername(peerId) {
    return userNames[peerId] || "Participant";
}

function setMediaState(peerId, cameraOn, micOn) {
    if (!peerId) return;
    mediaStates[peerId] = {
        cameraOn: cameraOn !== false,
        micOn: micOn !== false
    };
    applyMediaState(peerId, mediaStates[peerId].cameraOn, mediaStates[peerId].micOn);
}

function applyMediaState(peerId, cameraOn, micOn) {
    const card = document.getElementById(`video-card-${peerId}`);
    if (!card) return;

    const video = card.querySelector("video");
    const avatar = card.querySelector(".camera-off-avatar");
    const micIcon = card.querySelector(".remote-mic-icon");
    const camIcon = card.querySelector(".remote-cam-icon");

    if (cameraOn) {
        if (video) video.style.display = "block";
        if (avatar) avatar.style.display = "none";
        if (camIcon) {
            camIcon.className = "fa-solid fa-video remote-cam-icon";
            camIcon.style.color = "#ffffff";
        }
    } else {
        if (video) video.style.display = "none";
        if (avatar) avatar.style.display = "flex";
        if (camIcon) {
            camIcon.className = "fa-solid fa-video-slash remote-cam-icon";
            camIcon.style.color = "#ff4d4d";
        }
    }

    if (micOn) {
        if (micIcon) {
            micIcon.className = "fa-solid fa-microphone remote-mic-icon";
            micIcon.style.color = "#ffffff";
        }
    } else {
        if (micIcon) {
            micIcon.className = "fa-solid fa-microphone-slash remote-mic-icon";
            micIcon.style.color = "#ff4d4d";
        }
    }
}

window.applyMediaState = applyMediaState;
window.setMediaState = setMediaState;

function removePeer(peerId) {
    if (!peerId) return;

    const call = peers[peerId];
    delete peers[peerId];

    if (call) {
        try {
            call.close();
        } catch (err) {
            // ignore
        }
    }

    const card = document.getElementById(`video-card-${peerId}`);
    if (card) {
        const video = card.querySelector("video");
        if (video && video.srcObject && video.srcObject !== window.myStream) {
            video.srcObject = null;
        }
        card.remove();
    }

    delete userNames[peerId];
    delete mediaStates[peerId];
}

window.removePeer = removePeer;

function attachCall(call, peerId, name) {
    if (!call || !peerId) return;

    if (peers[peerId] && peers[peerId] !== call) {
        try {
            call.close();
        } catch (err) {
            // ignore
        }
        return;
    }

    peers[peerId] = call;
    rememberUser(peerId, name);

    call.on("stream", (userVideoStream) => {
        window.addVideoStream(userVideoStream, peerId, getUsername(peerId));
        const state = mediaStates[peerId];
        if (state) {
            applyMediaState(peerId, state.cameraOn, state.micOn);
        }
    });

    call.on("close", () => {
        if (peers[peerId] === call) {
            removePeer(peerId);
        }
    });

    call.on("error", () => {
        if (peers[peerId] === call) {
            removePeer(peerId);
        }
    });
}

function connectToNewUser(peerId, name) {
    if (!peerId || peerId === myPeerId) return;

    rememberUser(peerId, name);

    if (peers[peerId]) return;
    if (!window.myStream || !peer) return;

    const call = peer.call(peerId, window.myStream, {
        metadata: { username }
    });

    attachCall(call, peerId, name);
}

window.connectToNewUser = connectToNewUser;

function handleIncomingCall(call) {
    const peerId = call.peer;

    if (!peerId || peerId === myPeerId) {
        call.close();
        return;
    }

    const name =
        (call.metadata && call.metadata.username) ||
        getUsername(peerId);

    rememberUser(peerId, name);

    if (!window.myStream) {
        call.answer();
        return;
    }

    call.answer(window.myStream);

    if (peers[peerId]) {
        call.on("stream", (userVideoStream) => {
            window.addVideoStream(userVideoStream, peerId, getUsername(peerId));
        });
        return;
    }

    attachCall(call, peerId, name);
}

function tryJoinRoom() {
    if (!ROOM_ID || !myPeerId || !window.myStream || hasJoinedRoom) return;

    hasJoinedRoom = true;

    socket.emit("join-room", {
        roomId: ROOM_ID,
        username: username,
        peerId: myPeerId
    });
}

window.tryJoinRoom = tryJoinRoom;

if (ROOM_ID) {
    peer = new Peer(undefined, {
        host: window.location.hostname,
        port: window.location.port || (window.location.protocol === "https:" ? 443 : 80),
        path: "/peerjs",
        secure: window.location.protocol === "https:"
    });

    window.peer = peer;

    peer.on("open", (id) => {
        myPeerId = id;
        window.myPeerId = id;
        tryJoinRoom();
    });

    peer.on("call", handleIncomingCall);

    peer.on("disconnected", () => {
        if (!peer.destroyed) {
            peer.reconnect();
        }
    });
}

socket.on("existing-users", (users) => {
    users.forEach((user) => {
        if (!user.peerId || user.peerId === myPeerId) return;

        rememberUser(user.peerId, user.username);
        setMediaState(user.peerId, user.cameraOn, user.micOn);
        connectToNewUser(user.peerId, user.username);
    });
});

socket.on("user-connected", (user) => {
    if (!user.peerId || user.peerId === myPeerId) return;

    rememberUser(user.peerId, user.username);
    setMediaState(user.peerId, user.cameraOn, user.micOn);
});

socket.on("user-disconnected", (user) => {
    removePeer(user.peerId);
});

socket.on("media-state", (data) => {
    if (!data || !data.peerId || data.peerId === myPeerId) return;
    setMediaState(data.peerId, data.cameraOn, data.micOn);
});

socket.on("participants-update", (users) => {
    updateParticipants(users);

    users.forEach((user) => {
        if (!user.peerId || user.peerId === myPeerId) return;

        rememberUser(user.peerId, user.username);

        const card = document.getElementById(`video-card-${user.peerId}`);
        if (card) {
            const nameEl = card.querySelector(".video-user span");
            if (nameEl) nameEl.textContent = user.username;
        }

        if (typeof user.cameraOn === "boolean" || typeof user.micOn === "boolean") {
            setMediaState(user.peerId, user.cameraOn, user.micOn);
        }
    });
});

window.addEventListener("pagehide", () => {
    socket.emit("leave-room");
});

window.addEventListener("beforeunload", () => {
    socket.emit("leave-room");
});

const participants = document.getElementById("participants");
const participantCount = document.getElementById("participantCount");

function updateParticipants(users) {
    if (!participants) return;

    participants.innerHTML = "";

    users.forEach((user) => {
        const div = document.createElement("div");
        div.className = "participant";
        div.id = user.socketId;
        div.innerHTML = `
            <i class="fa-solid fa-user"></i>
            <span>${user.username}</span>
        `;
        participants.appendChild(div);
    });

    if (participantCount) {
        participantCount.innerText = users.length;
    }
}
