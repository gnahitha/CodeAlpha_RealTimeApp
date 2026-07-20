console.log("shareMeeting.js loaded");

const shareBtn = document.getElementById("shareBtn");

if (shareBtn) {

    shareBtn.addEventListener("click", async () => {

        const meetingLink = window.location.href;

        try {

            await navigator.clipboard.writeText(meetingLink);

            alert("Meeting Link Copied!\n\n" + meetingLink);

        } catch (err) {

            prompt("Copy this meeting link:", meetingLink);

        }

    });

}