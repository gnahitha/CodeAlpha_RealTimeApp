const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const saveSettings = document.getElementById("saveSettings");

if (settingsBtn) {

    settingsBtn.onclick = () => {

        settingsModal.style.display = "flex";

    };

}

if (saveSettings) {

    saveSettings.onclick = () => {

        settingsModal.style.display = "none";

    };

}

window.onclick = function(e){

    if(e.target==settingsModal){

        settingsModal.style.display="none";

    }

}