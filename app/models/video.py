from pydantic import BaseModel, Field, ConfigDict


class VideoMetaData(BaseModel):
    fps: float
    frame_count: int
    duration_seconds: float

    links: dict | None = Field(
        default=None,
        alias="_links"
    )

    model_config = ConfigDict(
        populate_by_name=True
    )