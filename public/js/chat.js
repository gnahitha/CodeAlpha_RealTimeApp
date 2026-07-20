const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

if (sendBtn) {

    sendBtn.addEventListener("click", () => {

        const message = messageInput.value.trim();

        if (!message) return;

        socket.emit("chat-message", {
            roomId: ROOM_ID,
            sender: localStorage.getItem("username"),
            message: message
        });

        messageInput.value = "";

    });

}

if (messageInput) {

    messageInput.addEventListener("keypress", (e) => {

        if (e.key === "Enter") {

            sendBtn.click();

        }

    });

}

socket.on("receive-message", (data) => {

    const box = document.createElement("div");

    box.className = "message";

    const now = new Date();

    const time =
        now.getHours().toString().padStart(2,"0")
        + ":"
        + now.getMinutes().toString().padStart(2,"0");

    box.innerHTML = `
        <strong>${data.sender}</strong><br>
        ${data.message}
        <span class="time">${time}</span>
    `;

    messages.appendChild(box);

    messages.scrollTop = messages.scrollHeight;

});