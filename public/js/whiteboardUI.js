const boardModal = document.getElementById("whiteboardModal");
const boardBtn = document.getElementById("whiteboardBtn");
const closeBtn = document.getElementById("closeBoard");

if (boardBtn && boardModal) {
    boardBtn.addEventListener("click", () => {
        boardModal.style.display = "flex";
    });
}

if (closeBtn && boardModal) {
    closeBtn.addEventListener("click", () => {
        boardModal.style.display = "none";
    });
}