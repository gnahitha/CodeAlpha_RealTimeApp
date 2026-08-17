const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

let unreadCount = 0;
window.chatOpen = false;

function getCurrentUsername() {
    return localStorage.getItem("username") || "Guest";
}

function isChatPanelOpen() {
    const panel = document.getElementById("chatPanel");
    return window.chatOpen === true || (panel && panel.classList.contains("open"));
}

function isOwnChatMessage(data) {
    if (data && data.socketId && typeof socket !== "undefined" && socket.id) {
        return data.socketId === socket.id;
    }

    return data && data.sender === getCurrentUsername();
}

function updateChatBadge() {
    const badge = document.getElementById("chatBadge");
    if (!badge) return;

    if (unreadCount <= 0) {
        badge.style.display = "none";
        badge.textContent = "";
        badge.classList.remove("visible");
        return;
    }

    badge.style.display = "flex";
    badge.classList.add("visible");
    badge.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
}

function resetUnreadMessages() {
    unreadCount = 0;
    updateChatBadge();
}

window.updateChatBadge = updateChatBadge;
window.resetUnreadMessages = resetUnreadMessages;

if (sendBtn) {

    sendBtn.addEventListener("click", () => {

        const message = messageInput.value.trim();

        if (!message) return;

        socket.emit("chat-message", {
            roomId: ROOM_ID,
            sender: getCurrentUsername(),
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

    if (!messages || !data) return;

    const box = document.createElement("div");

    box.className = "message";

    const now = new Date();

    const time =
        now.getHours().toString().padStart(2, "0")
        + ":"
        + now.getMinutes().toString().padStart(2, "0");

    box.innerHTML = `
        <strong>${data.sender}</strong><br>
        ${data.message}
        <span class="time">${time}</span>
    `;

    messages.appendChild(box);

    messages.scrollTop = messages.scrollHeight;

    if (isOwnChatMessage(data)) return;

    if (!isChatPanelOpen()) {
        unreadCount += 1;
        updateChatBadge();
    }

});

updateChatBadge();
