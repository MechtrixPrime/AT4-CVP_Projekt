
How to install Tesseract OCR Step by Step Guide:

#### Step 1:
Download the latest Tesseract OCR via [UB Mannheim Windows installer page](https://github.com/UB-Mannheim/tesseract/wiki)

#### Step 2:
Rename the installer to `tesseract-installer`

#### Step 3:
run this command via Laragon terminal

````
tesseract-installer.exe /S /D=C:\ProgramData\Laragon\www\Sources\Repos\Tesseract-OCR
````

#### Step 4
Run this command to check version
````
"C:\ProgramData\Laragon\www\Sources\Repos\Tesseract-OCR\tesseract.exe" --version
````

#### Step 5
Run this command to check if languages are installed
````
tesseract --list-langs
````

if it shows:
````
List of available languages in "C:\ProgramData\Laragon\www\Sources\Repos\Tesseract-OCR/tessdata/" (0):
````

Run this to install english:

````
curl.exe -L "https://github.com/tesseract-ocr/tessdata_best/raw/main/eng.traineddata" -o "C:\ProgramData\Laragon\www\Sources\Repos\Tesseract-OCR\tessdata\eng.traineddata"
````

Step 6:

Installing Python packages
Run the command:
````
python -m pip install -r requirements.txt
````