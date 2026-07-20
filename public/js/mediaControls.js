const cameraBtn = document.getElementById("cameraBtn");
const micBtn = document.getElementById("micBtn");

let cameraOn = true;
let micOn = true;

if (cameraBtn) {

    cameraBtn.addEventListener("click", () => {

        if (!myStream) return;

        const videoTrack = myStream.getVideoTracks()[0];

        if (!videoTrack) return;

        cameraOn = !cameraOn;

        videoTrack.enabled = cameraOn;
        const myCamIcon = document.getElementById("myCamIcon");
        const avatar = document.getElementById("cameraOffAvatar");
        const video = document.getElementById("myVideo");

        if (cameraOn) {

            myCamIcon.className = "fa-solid fa-video";
            myCamIcon.style.color = "#ffffff";

            video.style.display = "block";
            avatar.style.display = "none";

        } else {

            myCamIcon.className = "fa-solid fa-video-slash";
            myCamIcon.style.color = "#ff4d4d";

            video.style.display = "none";
            avatar.style.display = "flex";

        }

        if (cameraOn) {

            cameraBtn.style.background = "#3c4043";

            cameraBtn.innerHTML = `
                <i class="fa-solid fa-video"></i>
                <span>Camera</span>
            `;

        } else {

            cameraBtn.style.background = "#d93025";

            cameraBtn.innerHTML = `
                <i class="fa-solid fa-video-slash"></i>
                <span>Camera Off</span>
            `;

        }

    });

}

if (micBtn) {

    micBtn.addEventListener("click", () => {

        if (!myStream) return;

        const audioTrack = myStream.getAudioTracks()[0];

        if (!audioTrack) return;

        micOn = !micOn;

        audioTrack.enabled = micOn;
        const myMicIcon = document.getElementById("myMicIcon");

        if (micOn) {

            myMicIcon.className = "fa-solid fa-microphone";
            myMicIcon.style.color = "#ffffff";

        } else {

            myMicIcon.className = "fa-solid fa-microphone-slash";
            myMicIcon.style.color = "#ff4d4d";

        }

        if (micOn) {

            micBtn.style.background = "#3c4043";

            micBtn.innerHTML = `
                <i class="fa-solid fa-microphone"></i>
                <span>Mic</span>
            `;

        } else {

            micBtn.style.background = "#d93025";

            micBtn.innerHTML = `
                <i class="fa-solid fa-microphone-slash"></i>
                <span>Muted</span>
            `;

        }

    });

}