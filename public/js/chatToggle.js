const chatBtn = document.getElementById("chatBtn");
const chatPanel = document.getElementById("chatPanel");
const closeChat = document.getElementById("closeChat");

function setChatOpen(isOpen) {
    window.chatOpen = isOpen;

    if (chatPanel) {
        chatPanel.classList.toggle("open", isOpen);
    }

    if (isOpen && typeof window.resetUnreadMessages === "function") {
        window.resetUnreadMessages();
    }
}

if (chatBtn && chatPanel) {

    chatBtn.addEventListener("click", () => {

        setChatOpen(!chatPanel.classList.contains("open"));

    });

}

if (closeChat) {

    closeChat.addEventListener("click", () => {

        setChatOpen(false);

    });

}
