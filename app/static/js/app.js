const videoPlayer = document.getElementById("videoPlayer");
const extractButton = document.getElementById("extractButton");
const ocrOutput = document.getElementById("ocrOutput");
const copyButton = document.getElementById("copyButton");

const statusMessage = document.getElementById("statusMessage");
const errorMessage = document.getElementById("errorMessage");

videoPlayer.src = "/video/demo/stream";

// Extract text from the current video timestamp
let isExtracting = false;

extractButton.addEventListener("click", async () => {
    if (isExtracting) {
        return;
    }

    const timestamp = videoPlayer.currentTime;

    isExtracting = true;
    statusMessage.textContent = "Extracting code. Please wait.";
    errorMessage.textContent = "";

    try {
        const response = await fetch(
            `/video/demo/frame/${timestamp}/ocr`
        );

        if (!response.ok) {
            throw new Error("Failed to extract code.");
        }

        const result = await response.json();

        ocrOutput.textContent = result.text || "No text detected.";

        statusMessage.textContent = result.text
            ? "Code extraction completed."
            : "Extraction completed. No text was detected.";

    } catch (error) {
        ocrOutput.textContent = "Code extraction failed.";
        errorMessage.textContent = error.message;

    } finally {
        isExtracting = false;
    }
});

// Copy recognised code
copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(ocrOutput.textContent);

        statusMessage.textContent = "Code copied to clipboard.";
        errorMessage.textContent = "";

    } catch (error) {
        errorMessage.textContent =
            "Unable to copy code. Please check clipboard permissions.";
    }
});