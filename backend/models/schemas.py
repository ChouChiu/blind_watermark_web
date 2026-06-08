from pydantic import BaseModel


class EmbedResponse(BaseModel):
    success: bool
    image_base64: str | None = None
    wm_bit_length: int | None = None
    format: str | None = None
    error: str | None = None


class ExtractResponse(BaseModel):
    success: bool
    mode: str | None = None
    watermark: str | None = None
    error: str | None = None


class CapacityResponse(BaseModel):
    success: bool
    capacity: int | None = None
    error: str | None = None
