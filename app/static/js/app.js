
const videoPlayer = document.getElementById("videoPlayer");
const extractButton = document.getElementById("extractButton");
const ocrOutput = document.getElementById("ocrOutput");
const copyButton = document.getElementById("copyButton");

const statusMessage = document.getElementById("statusMessage");
const errorMessage = document.getElementById("errorMessage");

videoPlayer.src = "/video/demo/stream";

// Track extraction state
let isExtracting = false;
let hasExtractedText = false;

// Extract text from the current video timestamp
extractButton.addEventListener("click", async () => {

    // Prevent multiple extraction requests
    if (isExtracting) {
        return;
    }

    // Validate video source
    if (!videoPlayer.currentSrc && !videoPlayer.src) {
        errorMessage.textContent = "No video source is available.";
        return;
    }

    // Validate video readiness
    if (videoPlayer.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        errorMessage.textContent = "The video is not ready. Please wait for it to load.";
        return;
    }

    // Validate timestamp
    const timestamp = videoPlayer.currentTime;

    if (!Number.isFinite(timestamp) || timestamp < 0) {
        errorMessage.textContent = "The video timestamp is invalid.";
        return;
    }

    // Begin extraction
    isExtracting = true;
    hasExtractedText = false;

    statusMessage.textContent = "Extracting code. Please wait.";
    errorMessage.textContent = "";

    try {
        const response = await fetch(
            `/video/demo/frame/${timestamp}/ocr`
        );

        // Validate server response
        if (!response.ok) {
            throw new Error("Failed to extract code from the server.");
        }

        // Validate returned data
        const result = await response.json();

        if (!result || typeof result.text !== "string") {
            throw new Error("The server returned invalid OCR data.");
        }

        // Display extracted text
        if (result.text.trim().length > 0) {
            ocrOutput.textContent = result.text;
            hasExtractedText = true;

            statusMessage.textContent = "Code extraction completed.";
        } else {
            ocrOutput.textContent = "No text detected.";

            statusMessage.textContent =
                "Extraction completed. No text was detected.";
        }

    } catch (error) {
        ocrOutput.textContent = "Code extraction failed.";
        errorMessage.textContent = error.message;

    } finally {
        isExtracting = false;
    }
});

// Copy recognised code
copyButton.addEventListener("click", async () => {

    // Check whether there is extracted text
    if (!hasExtractedText) {
        errorMessage.textContent = "There is no extracted code to copy.";
        return;
    }

    try {
        await navigator.clipboard.writeText(ocrOutput.textContent);

        statusMessage.textContent = "Code copied to clipboard.";
        errorMessage.textContent = "";

    } catch (error) {
        errorMessage.textContent =
            "Unable to copy code. Please check clipboard permissions.";
    }
});


// Personalisation settings

const textSize = document.getElementById("textSize");
const highContrast = document.getElementById("highContrast");
const resetSettings = document.getElementById("resetSettings");
const settingsStatus = document.getElementById("settingsStatus");

// Default settings
const defaultSettings = {
    textSize: "16",
    highContrast: false
};

// Apply saved settings
function applySettings() {

    ocrOutput.style.fontSize = `${textSize.value}px`;

    document.body.classList.toggle(
        "high-contrast",
        highContrast.checked
    );
}

// Save settings to browser storage
function saveSettings() {

    const settings = {
        textSize: textSize.value,
        highContrast: highContrast.checked
    };

    localStorage.setItem(
        "codingVideoSettings",
        JSON.stringify(settings)
    );

    applySettings();

    settingsStatus.textContent = "Personalisation settings saved.";
}

// Load saved settings
function loadSettings() {

    const savedSettings = localStorage.getItem(
        "codingVideoSettings"
    );

    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);

            textSize.value = ["14", "16", "20", "24"].includes(settings.textSize)
                ? settings.textSize
                : defaultSettings.textSize;

            highContrast.checked = settings.highContrast === true;

        } catch (error) {
            textSize.value = defaultSettings.textSize;
            highContrast.checked = defaultSettings.highContrast;
        }

    } else {
        textSize.value = defaultSettings.textSize;
        highContrast.checked = defaultSettings.highContrast;
    }

    applySettings();
}

// Listen for setting changes
textSize.addEventListener("change", saveSettings);

highContrast.addEventListener("change", saveSettings);

// Reset settings
resetSettings.addEventListener("click", () => {

    textSize.value = defaultSettings.textSize;
    highContrast.checked = defaultSettings.highContrast;

    localStorage.removeItem("codingVideoSettings");

    applySettings();

    settingsStatus.textContent = "Personalisation settings have been reset.";
});

// Load settings when the application starts
loadSettings();
