from pathlib import Path

from fastapi import HTTPException, APIRouter
from fastapi import Response
from app.services.video_service import CodingVideo, VIDEOS
from app.models.video import VideoMetaData
from fastapi.responses import FileResponse
router = APIRouter()

@router.get("/video")
def list_videos():
    """List all available videos with HATEOAS-style links."""
    return {
        "count": len(VIDEOS),
        "videos": [
            {
                "id": vid,
                "path": str(path), # Not standard for debug only
                "_links": {
                    "self": f"/video/{vid}",
                    "frame_example": f"/video/{vid}/frame/1.0"
                }
            }
            for vid, path in VIDEOS.items()
        ]
    }


def _open_vid_or_404(vid: str) -> CodingVideo:
    path = VIDEOS.get(vid)
    if not path or not path.is_file():
        raise HTTPException(status_code=404, detail="Video not found")
    try:
        return CodingVideo(path)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Could not open video {e}")


def _meta(video: CodingVideo) -> VideoMetaData:
    return VideoMetaData(
            fps=video.fps,
            frame_count=video.frame_count,
            duration_seconds=video.duration
    )


@router.get("/video/{vid}", response_model=VideoMetaData)
def video(vid: str):
    video = _open_vid_or_404(vid)
    try:
            meta = _meta(video)
            meta._links = {
                "self": f"/video/{vid}",
                "frames": f"/video/{vid}/frame/{{seconds}}"
            }
            return meta
    finally:
        video.capture.release()


@router.get("/video/{vid}/frame/{t}", response_class=Response)
def video_frame(vid: str, t: float):
    video = _open_vid_or_404(vid)

    try:
        image = video.get_image_as_bytes(t)

        return Response(
            content=image,
            media_type="image/png"
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    finally:
        video.capture.release()


@router.get("/video/{vid}/frame/{t}/ocr")
def ocr_video(vid: str, t: float):
    video = _open_vid_or_404(vid)
    try:
        text = video.get_text_at_time(t)
        return {
            "video_id": vid,
            "timestamp_seconds": t,
            "text": text
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        video.capture.release()


@router.get("/video/{vid}/stream")
def stream_video(vid: str):
    path = VIDEOS.get(vid)

    if not path or not path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    return FileResponse(
        path,
        media_type="video/mp4"
    )
