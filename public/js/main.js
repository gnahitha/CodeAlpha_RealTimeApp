function createRoom() {

    const roomId = crypto.randomUUID();

    window.location.href = "/room/" + roomId;

}

function joinRoom() {

    const roomId = document.getElementById("roomId").value.trim();

    if (roomId === "") {

        alert("Please Enter Room ID");
        return;

    }

    window.location.href = "/room/" + roomId;

}