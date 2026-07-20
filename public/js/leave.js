const leaveBtn = document.getElementById("leaveBtn");

if (leaveBtn) {

    leaveBtn.addEventListener("click", () => {

        if (confirm("Leave the meeting?")) {

            window.location.href = "/room";

        }

    });

}