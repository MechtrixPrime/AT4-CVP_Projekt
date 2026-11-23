from pydantic import BaseModel


class VideoMetaData(BaseModel):
    fps: float
    frame_count: int
    duration_seconds: float
    _links: dict | None = None