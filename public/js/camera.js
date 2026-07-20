const myVideo = document.getElementById("myVideo");

let myStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then((stream) => {

    myStream = stream;

    window.myStream = stream;

    myVideo.srcObject = stream;

    myVideo.onloadedmetadata = () => {

        myVideo.play();

    };

    // Answer incoming calls
    peer.on("call", (call) => {

        call.answer(stream);

        const video = document.createElement("video");

        video.autoplay = true;
        video.playsInline = true;

        window.peers[call.peer] = call;

        call.on("stream", (userVideoStream) => {

            window.addVideoStream(video, userVideoStream);

        });

        call.on("close", () => {

            video.parentElement?.remove();

            delete window.peers[call.peer];

        });

    });

})
.catch((err) => {

    console.log(err);

    alert("Camera Permission Denied");

});

function addVideoStream(video, stream, username = "Participant") {

    // Don't add same stream twice
    if (video.srcObject) return;

    video.srcObject = stream;

    const videoGrid = document.getElementById("video-grid");

    const card = document.createElement("div");

    card.className = "video-card";

    const footer = document.createElement("div");

    footer.className = "video-footer";

    footer.innerHTML = `
        <div class="video-user">
            <i class="fa-solid fa-circle-user"></i>
            <span>${username}</span>
        </div>

        <div class="video-status">
            <i class="fa-solid fa-microphone"></i>
            <i class="fa-solid fa-video"></i>
        </div>
    `;

    card.appendChild(video);

    card.appendChild(footer);

    videoGrid.appendChild(card);

    video.onloadedmetadata = () => {

        video.play();

    };

}

window.addVideoStream = addVideoStream;