const chatBtn = document.getElementById("chatBtn");
const chatPanel = document.getElementById("chatPanel");
const closeChat = document.getElementById("closeChat");

if (chatBtn && chatPanel) {

    chatBtn.addEventListener("click", () => {

        chatPanel.classList.toggle("open");

    });

}

if (closeChat) {

    closeChat.addEventListener("click", () => {

        chatPanel.classList.remove("open");

    });

}