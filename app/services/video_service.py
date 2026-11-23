from pathlib import Path
import cv2
import numpy as np
from PIL import Image
import pytesseract
import os

TESSERACT_DIR = r"C:\ProgramData\Laragon\www\Sources\Repos\Tesseract-OCR"

pytesseract.pytesseract.tesseract_cmd = os.path.join(
    TESSERACT_DIR,
    "tesseract.exe"
)

# Tesseract language data directory
os.environ["TESSDATA_PREFIX"] = os.path.join(
    TESSERACT_DIR,
    "tessdata"
)


# Temp path
VID_PATH = Path("../../resources/videos/oop.mp4")

class CodingVideo:
    capture: cv2.VideoCapture


    def __init__(self, video: Path | str):
        self.capture = cv2.VideoCapture(str(video))

        if not self.capture.isOpened():
            raise ValueError(f"Cannot open {video}")

        self.fps = self.capture.get(cv2.CAP_PROP_FPS)
        self.frame_count = int(self.capture.get(cv2.CAP_PROP_FRAME_COUNT))
        self.duration = self.frame_count / self.fps


    def __str__(self) -> str:
        """Displays key metadata from the video

        Specifically, the following information is shown:
            FPS - Number of frames per second rounded to two decimal points
            FRAME COUNT - The total number of frames in the video
            DURATION (minutes) - Calculated total duration of the video given FPS and FRAME COUNT

        Reference
        ----------
        https://docs.opencv.org/3.4/d4/d15/group__videoio__flags__base.html#gaeb8dd9c89c10a5c63c139bf7c4f5704d
        """
        return (
            f"FPS: {self.fps:.2f}\n"
            f"FRAME COUNT: {self.frame_count}\n"
            f"DURATION: {self.duration / 60 :.2f}\n"
        )


    def get_frame_number_at_time(self, seconds: int) -> int:
        """Given a time in seconds, returns the value of the nearest frame"""
        if seconds < 0:
            raise ValueError("Seconds cannot be negative")

        frame_number = round(seconds * self.fps)

        if frame_number >= self.frame_count:
            raise ValueError('Timestamp exceeds video duration')

        return frame_number


    def get_frame_rgb_array(self, frame_number: int) -> np.ndarray:
        """Returns a numpy N-dimensional array (ndarray)

        The array represents the RGB values of each pixel in a given frame

        Note: cv2 defaults to BGR format, so this function converts the color space to RGB

        """
        if frame_number < 0 or frame_number >= self.frame_count:
            raise ValueError("Invalid frame number")

        self.capture.set(cv2.CAP_PROP_POS_FRAMES, frame_number)

        ok, frame = self.capture.read()

        if not ok or frame is None:
            raise ValueError("Failed to read video frame")

        return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    def get_image_as_bytes(self, seconds: int) -> bytes:
        self.capture.set(cv2.CAP_PROP_POS_FRAMES, self.get_frame_number_at_time(seconds))
        ok, frame = self.capture.read()
        if not ok or frame is None:
            raise ValueError("Invalid frame in target location")
        ok, buf = cv2.imencode(".png", frame)
        if not ok:
            raise ValueError("Failed to encode frame")
        return buf.tobytes()


    def save_as_image(self, seconds: int, output_path: Path | str = 'output.png') -> None:
      """Saves the given frame as a png image

      https://pillow.readthedocs.io/en/stable/reference/Image.html

      """
      frame = self.get_frame_rgb_array(self.get_frame_number_at_time(seconds))

      image = Image.fromarray(frame)
      image.save(output_path)


    def get_text_at_time(self, seconds: int) -> str:
        """Extracts the text from a video frame at the given timestamp."""
        frame_number = self.get_frame_number_at_time(seconds)
        frame = self.get_frame_rgb_array(frame_number)

        return pytesseract.image_to_string(frame)

def test():
    pass
    oop = CodingVideo(VID_PATH)
    print(oop)
    oop.save_as_image(132)

    print(oop.get_text_at_time(132))


if __name__ == '__main__':
    test()