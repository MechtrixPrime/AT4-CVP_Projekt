
const videoPlayer = document.getElementById("videoPlayer");
const extractButton = document.getElementById("extractButton");
const ocrOutput = document.getElementById("ocrOutput");
const copyButton = document.getElementById("copyButton");
videoPlayer.src = "/video/demo/stream";

// Extract text from the current video timestamp
extractButton.addEventListener("click", async () => {
    const timestamp = videoPlayer.currentTime;

    try {
        const response = await fetch(
            `/video/demo/frame/${timestamp}/ocr`
        );

        if (!response.ok) {
            throw new Error("Failed to extract code");
        }

        const result = await response.json();

        ocrOutput.textContent = result.text || "No text detected.";

    } catch (error) {
        ocrOutput.textContent = error.message;
    }
});

// Copy recognised code
copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(ocrOutput.textContent);
});
