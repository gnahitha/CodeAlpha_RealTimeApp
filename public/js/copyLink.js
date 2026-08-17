function showMeetToast(message) {
    const container = document.getElementById("notificationContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "meet-toast";
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 250);
    }, 2200);
}

window.showMeetToast = showMeetToast;

const copyBtn = document.getElementById("copyLinkBtn");

if (copyBtn) {

    const originalCopyHtml = copyBtn.innerHTML;

    copyBtn.addEventListener("click", async () => {

        const link = ROOM_ID
            ? `${window.location.origin}/room/${ROOM_ID}`
            : window.location.href;

        try {

            await navigator.clipboard.writeText(link);

            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied</span>';
            showMeetToast("Meeting link copied");

            setTimeout(() => {
                copyBtn.innerHTML = originalCopyHtml;
            }, 2000);

        } catch (err) {
            showMeetToast("Unable to copy link");
        }

    });

}
