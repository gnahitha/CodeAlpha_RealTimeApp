const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");
const themeOptions = document.querySelectorAll(".theme-option[data-theme]");
const settingsMicToggle = document.getElementById("settingsMicToggle");
const settingsCamToggle = document.getElementById("settingsCamToggle");
const settingsParticipantsBtn = document.getElementById("settingsParticipantsBtn");

function getSavedTheme() {
    return localStorage.getItem("meetx-theme") === "light" ? "light" : "dark";
}

function applyTheme(theme) {
    const value = theme === "light" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", value);
    document.body.setAttribute("data-theme", value);
    localStorage.setItem("meetx-theme", value);

    themeOptions.forEach((option) => {
        option.classList.toggle("active", option.dataset.theme === value);
        option.setAttribute("aria-pressed", option.dataset.theme === value ? "true" : "false");
    });
}

function positionSettingsPanel() {
    if (!settingsBtn || !settingsPanel) return;

    const buttonRect = settingsBtn.getBoundingClientRect();
    const margin = 12;
    const panelWidth = Math.min(settingsPanel.offsetWidth || 320, window.innerWidth - margin * 2);
    const gap = 14;

    let left = buttonRect.left + buttonRect.width / 2 - panelWidth / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - panelWidth - margin));

    settingsPanel.style.left = `${left}px`;
    settingsPanel.style.bottom = `${window.innerHeight - buttonRect.top + gap}px`;
}

function isSettingsOpen() {
    return settingsPanel && settingsPanel.classList.contains("open");
}

function syncSettingsMediaToggles() {
    const state = typeof window.getMediaControlState === "function"
        ? window.getMediaControlState()
        : { cameraOn: true, micOn: true };

    if (settingsMicToggle) {
        settingsMicToggle.classList.toggle("on", state.micOn);
        settingsMicToggle.setAttribute("aria-pressed", state.micOn ? "true" : "false");
    }

    if (settingsCamToggle) {
        settingsCamToggle.classList.toggle("on", state.cameraOn);
        settingsCamToggle.setAttribute("aria-pressed", state.cameraOn ? "true" : "false");
    }
}

window.syncSettingsMediaToggles = syncSettingsMediaToggles;

function openSettings() {
    if (!settingsPanel) return;

    if (typeof window.closeShareModal === "function") {
        window.closeShareModal();
    }

    settingsPanel.classList.add("open");
    syncSettingsMediaToggles();
    positionSettingsPanel();
}

function closeSettingsPanel() {
    if (!settingsPanel) return;
    settingsPanel.classList.remove("open");
}

window.closeSettingsPanel = closeSettingsPanel;

function toggleSettings(event) {
    if (event) {
        event.stopPropagation();
    }

    if (isSettingsOpen()) {
        closeSettingsPanel();
    } else {
        openSettings();
    }
}

if (ROOM_ID) {
    applyTheme(getSavedTheme());
}

if (settingsBtn && settingsPanel) {

    settingsBtn.addEventListener("click", toggleSettings);

    settingsPanel.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    if (closeSettings) {
        closeSettings.addEventListener("click", (event) => {
            event.stopPropagation();
            closeSettingsPanel();
        });
    }

    themeOptions.forEach((option) => {
        option.addEventListener("click", () => {
            applyTheme(option.dataset.theme);
        });
    });

    if (settingsMicToggle) {
        settingsMicToggle.addEventListener("click", () => {
            const state = typeof window.getMediaControlState === "function"
                ? window.getMediaControlState()
                : { micOn: true };

            if (typeof window.setMicrophoneEnabled === "function") {
                window.setMicrophoneEnabled(!state.micOn);
            }
        });
    }

    if (settingsCamToggle) {
        settingsCamToggle.addEventListener("click", () => {
            const state = typeof window.getMediaControlState === "function"
                ? window.getMediaControlState()
                : { cameraOn: true };

            if (typeof window.setCameraEnabled === "function") {
                window.setCameraEnabled(!state.cameraOn);
            }
        });
    }

    if (settingsParticipantsBtn) {
        settingsParticipantsBtn.addEventListener("click", () => {
            const participantsPanel = document.getElementById("participantsPanel");
            if (participantsPanel) {
                participantsPanel.classList.add("open");
            }
            closeSettingsPanel();
        });
    }

    document.addEventListener("click", (event) => {
        if (!isSettingsOpen()) return;
        if (settingsPanel.contains(event.target) || settingsBtn.contains(event.target)) return;
        closeSettingsPanel();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isSettingsOpen()) {
            closeSettingsPanel();
        }
    });

    window.addEventListener("resize", () => {
        if (isSettingsOpen()) {
            positionSettingsPanel();
        }
    });

}
