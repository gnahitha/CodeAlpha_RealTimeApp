const myVideo = document.getElementById("myVideo");

let myStream;

if (ROOM_ID) {

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
    .then((stream) => {

        myStream = stream;
        window.myStream = stream;

        if (myVideo) {
            myVideo.srcObject = stream;
            myVideo.onloadedmetadata = () => {
                myVideo.play();
            };
        }

        if (typeof window.tryJoinRoom === "function") {
            window.tryJoinRoom();
        }

    })
    .catch((err) => {

        console.log(err);
        alert("Camera Permission Denied");

    });

}

function addVideoStream(stream, peerId, username = "Participant") {

    if (!stream || !peerId) return;
    if (peerId === window.myPeerId) return;

    const videoGrid = document.getElementById("video-grid");
    if (!videoGrid) return;

    const existingCard = document.getElementById(`video-card-${peerId}`);

    if (existingCard) {
        const video = existingCard.querySelector("video");
        if (video && video.srcObject !== stream) {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play().catch(() => {});
            };
        }

        const nameEl = existingCard.querySelector(".video-user span");
        if (nameEl && username) {
            nameEl.textContent = username;
        }

        const letterEl = existingCard.querySelector(".avatar-letter");
        if (letterEl && username) {
            letterEl.textContent = username.charAt(0).toUpperCase();
        }

        const avatarNameEl = existingCard.querySelector(".camera-off-avatar h3");
        if (avatarNameEl && username) {
            avatarNameEl.textContent = username;
        }

        return;
    }

    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.srcObject = stream;

    const card = document.createElement("div");
    card.className = "video-card";
    card.id = `video-card-${peerId}`;

    const initial = (username || "P").charAt(0).toUpperCase();

    const avatar = document.createElement("div");
    avatar.className = "camera-off-avatar";
    avatar.innerHTML = `
        <div class="avatar-letter">${initial}</div>
        <h3>${username}</h3>
    `;

    const overlay = document.createElement("div");
    overlay.className = "video-overlay";
    overlay.innerHTML = `
        <div class="video-user">
            <i class="fa-solid fa-circle-user"></i>
            <span>${username}</span>
        </div>
        <div class="video-status">
            <i class="fa-solid fa-microphone remote-mic-icon"></i>
            <i class="fa-solid fa-video remote-cam-icon"></i>
        </div>
    `;

    card.appendChild(video);
    card.appendChild(avatar);
    card.appendChild(overlay);
    videoGrid.appendChild(card);

    video.onloadedmetadata = () => {
        video.play().catch(() => {});
    };

}

window.addVideoStream = addVideoStream;
