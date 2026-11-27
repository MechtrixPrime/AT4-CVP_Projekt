# Accessible Study Companion

## Overview

Accessible Study Companion is a browser-based application designed to help students access programming tutorial videos and extract programming code from video frames using Optical Character Recognition (OCR).

The application focuses on accessibility and usability, providing features such as keyboard navigation, screen-reader support, adjustable text sizes and high-contrast mode.

### Core Technologies and Dependencies

The project uses the following technologies:

- **Python** – Backend programming language.
- **FastAPI** – Provides the backend API and server.
- **HTML** – Structures the frontend interface.
- **CSS** – Controls the application's appearance and accessibility styling.
- **JavaScript** – Handles frontend interactions, validation and communication with the backend.
- **OpenCV** – Processes video files and extracts individual frames.
- **Pillow** – Handles image processing.
- **pytesseract** – Python wrapper used to communicate with the Tesseract OCR engine.
- **Tesseract OCR** – Performs optical character recognition to extract text from video frames.

### Installation and Setup

#### 1. Install Tesseract OCR

Tesseract OCR must be installed separately because `pytesseract` is only a Python wrapper for the OCR engine.

For detailed Windows installation instructions, including downloading Tesseract, configuring its installation directory and installing the English language data, refer to:

[**Tesseract OCR Installation Guide**](Install_guide.md)

#### 2. Set Up the Python Environment

Create and activate a Python virtual environment for the project.

Install the required Python packages using:

```bash
python -m pip install -r requirements.txt
```

#### 3. Start the Application

Once the dependencies are installed, start the FastAPI server using:

```bash
python -m uvicorn app.main:app --reload
```

The application should then be accessible at:

```text
http://127.0.0.1:8000/
```

The interactive FastAPI API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### Additional Information

- The application requires Tesseract OCR to be installed and accessible to the Python application.
- The included `install_guide.md` provides Windows-specific installation instructions using the configured Laragon directory.
- The `requirements.txt` file contains the Python dependencies required to run the application.