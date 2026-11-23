# Overview

Include a brief overview of the project, include:

- How do you deploy and run the project?
- What are its core dependencies?
- Who is it for and why?


### Tesseract OCR installation

This project uses `pytesseract` as a Python wrapper for the Tesseract OCR engine.

The Tesseract OCR executable must be installed separately.

For Windows:
1. Download and install Tesseract from the [UB Mannheim Windows installer page](https://github.com/UB-Mannheim/tesseract/wiki).
2. Ensure the Tesseract installation directory is added to your system PATH.
3. Open a terminal and run `tesseract --version` to verify the installation.

The Python wrapper is installed through the project's dependencies using:

```bash
uv sync
```

If Tesseract is not available through PATH, its executable location must be configured in the Python application.