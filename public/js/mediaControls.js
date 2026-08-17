const cameraBtn = document.getElementById("cameraBtn");
const micBtn = document.getElementById("micBtn");

let cameraOn = true;
let micOn = true;

function getLocalStream() {
    return window.myStream || myStream;
}

function emitMediaState() {
    if (!ROOM_ID || typeof socket === "undefined") return;

    socket.emit("media-state", {
        roomId: ROOM_ID,
        peerId: window.myPeerId,
        cameraOn,
        micOn
    });
}

function applyCameraState(enabled) {
    const stream = getLocalStream();
    if (!stream) return false;

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return false;

    cameraOn = enabled;
    videoTrack.enabled = cameraOn;

    const myCamIcon = document.getElementById("myCamIcon");
    const avatar = document.getElementById("cameraOffAvatar");
    const video = document.getElementById("myVideo");

    if (cameraOn) {
        if (myCamIcon) {
            myCamIcon.className = "fa-solid fa-video";
            myCamIcon.style.color = "#ffffff";
        }
        if (video) video.style.display = "block";
        if (avatar) avatar.style.display = "none";
        if (cameraBtn) {
            cameraBtn.style.background = "#3c4043";
            cameraBtn.innerHTML = `
                <i class="fa-solid fa-video"></i>
                <span>Camera</span>
            `;
        }
    } else {
        if (myCamIcon) {
            myCamIcon.className = "fa-solid fa-video-slash";
            myCamIcon.style.color = "#ff4d4d";
        }
        if (video) video.style.display = "none";
        if (avatar) avatar.style.display = "flex";
        if (cameraBtn) {
            cameraBtn.style.background = "#d93025";
            cameraBtn.innerHTML = `
                <i class="fa-solid fa-video-slash"></i>
                <span>Camera Off</span>
            `;
        }
    }

    emitMediaState();

    if (typeof window.syncSettingsMediaToggles === "function") {
        window.syncSettingsMediaToggles();
    }

    return true;
}

function applyMicState(enabled) {
    const stream = getLocalStream();
    if (!stream) return false;

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return false;

    micOn = enabled;
    audioTrack.enabled = micOn;

    const myMicIcon = document.getElementById("myMicIcon");

    if (micOn) {
        if (myMicIcon) {
            myMicIcon.className = "fa-solid fa-microphone";
            myMicIcon.style.color = "#ffffff";
        }
        if (micBtn) {
            micBtn.style.background = "#3c4043";
            micBtn.innerHTML = `
                <i class="fa-solid fa-microphone"></i>
                <span>Mic</span>
            `;
        }
    } else {
        if (myMicIcon) {
            myMicIcon.className = "fa-solid fa-microphone-slash";
            myMicIcon.style.color = "#ff4d4d";
        }
        if (micBtn) {
            micBtn.style.background = "#d93025";
            micBtn.innerHTML = `
                <i class="fa-solid fa-microphone-slash"></i>
                <span>Muted</span>
            `;
        }
    }

    emitMediaState();

    if (typeof window.syncSettingsMediaToggles === "function") {
        window.syncSettingsMediaToggles();
    }

    return true;
}

window.getMediaControlState = function () {
    return {
        cameraOn,
        micOn
    };
};

window.setCameraEnabled = function (enabled) {
    return applyCameraState(enabled);
};

window.setMicrophoneEnabled = function (enabled) {
    return applyMicState(enabled);
};

if (cameraBtn) {
    cameraBtn.addEventListener("click", () => {
        applyCameraState(!cameraOn);
    });
}

if (micBtn) {
    micBtn.addEventListener("click", () => {
        applyMicState(!micOn);
    });
}
