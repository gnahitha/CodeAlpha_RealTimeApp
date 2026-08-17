(function () {
    const inviteShareBtn = document.getElementById("shareBtn");
    const shareModal = document.getElementById("shareModal");
    const shareModalCard = document.querySelector(".share-modal-card");
    const closeShareModalBtn = document.getElementById("closeShareModal");
    const shareMeetingLink = document.getElementById("shareMeetingLink");
    const shareCopyBtn = document.getElementById("shareCopyBtn");
    const shareWhatsAppBtn = document.getElementById("shareWhatsAppBtn");
    const shareEmailBtn = document.getElementById("shareEmailBtn");
    const shareNativeBtn = document.getElementById("shareNativeBtn");

    if (!inviteShareBtn || !shareModal) return;

    function getMeetingUrl() {
        if (typeof ROOM_ID === "string" && ROOM_ID) {
            return `${window.location.origin}/room/${ROOM_ID}`;
        }
        return window.location.href;
    }

    function notify(message) {
        if (typeof window.showMeetToast === "function") {
            window.showMeetToast(message);
        }
    }

    function isShareOpen() {
        return shareModal.classList.contains("open");
    }

    function openShareModal() {
        if (typeof window.closeSettingsPanel === "function") {
            window.closeSettingsPanel();
        }

        const meetingUrl = getMeetingUrl();
        if (shareMeetingLink) {
            shareMeetingLink.value = meetingUrl;
        }

        shareModal.classList.add("open");
        shareModal.setAttribute("aria-hidden", "false");
    }

    function closeShareModal() {
        shareModal.classList.remove("open");
        shareModal.setAttribute("aria-hidden", "true");

        if (shareCopyBtn) {
            shareCopyBtn.innerHTML = '<i class="fa-regular fa-copy"></i><span>Copy link</span>';
        }
    }

    window.closeShareModal = closeShareModal;

    inviteShareBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        if (isShareOpen()) {
            closeShareModal();
        } else {
            openShareModal();
        }
    });

    if (closeShareModalBtn) {
        closeShareModalBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            closeShareModal();
        });
    }

    shareModal.addEventListener("click", (event) => {
        if (event.target === shareModal) {
            closeShareModal();
        }
    });

    if (shareModalCard) {
        shareModalCard.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isShareOpen()) {
            closeShareModal();
        }
    });

    if (shareCopyBtn) {
        shareCopyBtn.addEventListener("click", async () => {
            const meetingUrl = getMeetingUrl();

            try {
                await navigator.clipboard.writeText(meetingUrl);

                shareCopyBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied</span>';
                notify("Meeting link copied");

                setTimeout(() => {
                    shareCopyBtn.innerHTML = '<i class="fa-regular fa-copy"></i><span>Copy link</span>';
                }, 2000);
            } catch (err) {
                notify("Unable to copy link");
            }
        });
    }

    if (shareWhatsAppBtn) {
        shareWhatsAppBtn.addEventListener("click", () => {
            const meetingUrl = getMeetingUrl();
            const text = encodeURIComponent(`Join my MeetX meeting: ${meetingUrl}`);
            window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
        });
    }

    if (shareEmailBtn) {
        shareEmailBtn.addEventListener("click", () => {
            const meetingUrl = getMeetingUrl();
            const subject = encodeURIComponent("Join my MeetX meeting");
            const body = encodeURIComponent(`Join my meeting: ${meetingUrl}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        });
    }

    if (shareNativeBtn) {
        if (typeof navigator.share === "function") {
            shareNativeBtn.addEventListener("click", async () => {
                try {
                    await navigator.share({
                        title: "Join my MeetX meeting",
                        text: "Join my MeetX meeting",
                        url: getMeetingUrl()
                    });
                } catch (err) {
                    if (err && err.name !== "AbortError") {
                        console.log(err);
                    }
                }
            });
        } else {
            shareNativeBtn.hidden = true;
        }
    }
})();
