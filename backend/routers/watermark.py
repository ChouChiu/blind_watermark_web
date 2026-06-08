from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import asyncio

from services.watermark_service import (
    embed_watermark_sync,
    extract_watermark_sync,
    get_capacity_sync,
)

router = APIRouter(prefix="/api", tags=["watermark"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.get("/health")
async def health():
    return {"status": "ok"}


@router.post("/embed")
async def embed(
    image: UploadFile = File(...),
    watermark_text: str | None = Form(None),
    watermark_image: UploadFile | None = File(None),
    password_img: int = Form(1),
    password_wm: int = Form(1),
    mode: str = Form("str"),
    output_format: str = Form("png"),
):
    image_bytes = await image.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image file too large (max 10MB)")

    watermark_image_bytes = None
    if watermark_image is not None:
        watermark_image_bytes = await watermark_image.read()
        if len(watermark_image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="Watermark image too large (max 10MB)")

    result = await asyncio.to_thread(
        embed_watermark_sync,
        image_bytes,
        watermark_text,
        watermark_image_bytes,
        password_img,
        password_wm,
        mode,
        output_format,
    )

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Embed failed"))

    return result


@router.post("/extract")
async def extract(
    image: UploadFile = File(...),
    password_img: int = Form(1),
    password_wm: int = Form(1),
    mode: str = Form("str"),
    wm_shape: int | None = Form(None),
    wm_shape_w: int | None = Form(None),
    wm_shape_h: int | None = Form(None),
):
    image_bytes = await image.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image file too large (max 10MB)")

    result = await asyncio.to_thread(
        extract_watermark_sync,
        image_bytes,
        password_img,
        password_wm,
        mode,
        wm_shape,
        wm_shape_w,
        wm_shape_h,
    )

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Extract failed"))

    return result


@router.post("/capacity")
async def capacity(
    image: UploadFile = File(...),
    password_img: int = Form(1),
):
    image_bytes = await image.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Image file too large (max 10MB)")

    result = await asyncio.to_thread(
        get_capacity_sync,
        image_bytes,
        password_img,
    )

    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Capacity calculation failed"))

    return result
