const screenShareBtn = document.getElementById("shareScreenBtn");

if (screenShareBtn) {

    screenShareBtn.onclick = async () => {

        try {

            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });

            const videoTrack = stream.getVideoTracks()[0];

            myVideo.srcObject = stream;

            videoTrack.onended = () => {
                location.reload();
            };

        } catch (err) {
            console.log(err);
        }

    };

}
