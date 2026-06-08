import multiprocessing
import sys

# Patch: blind_watermark calls set_start_method('fork') at import time,
# which conflicts with uvicorn's multiprocessing context.
# We only use mode='common' (sequential), so this is safe.
_original_set_start_method = multiprocessing.set_start_method


def _safe_set_start_method(*args, **kwargs):
    try:
        _original_set_start_method(*args, **kwargs)
    except RuntimeError:
        pass


multiprocessing.set_start_method = _safe_set_start_method

from blind_watermark import WaterMark

multiprocessing.set_start_method = _original_set_start_method

import numpy as np
import cv2
import tempfile
import os
import base64


def embed_watermark_sync(
    image_bytes: bytes,
    watermark_text: str | None,
    watermark_image_bytes: bytes | None,
    password_img: int,
    password_wm: int,
    mode: str,
    output_format: str,
) -> dict:
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = os.path.join(tmpdir, "input.png")
            with open(input_path, "wb") as f:
                f.write(image_bytes)

            bwm = WaterMark(password_img=password_img, password_wm=password_wm)
            bwm.read_img(input_path)

            if mode == "str":
                if not watermark_text:
                    return {"success": False, "error": "watermark_text is required for mode='str'"}
                bwm.read_wm(watermark_text, mode="str")
                # Calculate actual wm_bit length matching the library's conversion
                byte = bin(int(watermark_text.encode('utf-8').hex(), base=16))[2:]
                wm_bit_length = len(byte)
            elif mode == "img":
                if not watermark_image_bytes:
                    return {"success": False, "error": "watermark_image is required for mode='img'"}
                wm_path = os.path.join(tmpdir, "wm.png")
                with open(wm_path, "wb") as f:
                    f.write(watermark_image_bytes)
                bwm.read_wm(wm_path, mode="img")
                wm_img = cv2.imread(wm_path, cv2.IMREAD_GRAYSCALE)
                if wm_img is None:
                    return {"success": False, "error": "Failed to read watermark image"}
                wm_bit_length = int(np.prod(wm_img.shape))
            else:
                return {"success": False, "error": f"Unsupported mode: {mode}"}

            ext = output_format.lower()
            if ext not in ("png", "jpg", "jpeg", "bmp"):
                ext = "png"
            output_path = os.path.join(tmpdir, f"output.{ext}")
            bwm.embed(output_path)

            with open(output_path, "rb") as f:
                result_bytes = f.read()
            image_base64 = base64.b64encode(result_bytes).decode("utf-8")

            return {
                "success": True,
                "image": image_base64,
                "wm_bit_length": wm_bit_length,
                "format": ext,
            }
    except Exception as e:
        return {"success": False, "error": str(e)}


def extract_watermark_sync(
    image_bytes: bytes,
    password_img: int,
    password_wm: int,
    mode: str,
    wm_shape: int | None,
    wm_shape_w: int | None,
    wm_shape_h: int | None,
) -> dict:
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = os.path.join(tmpdir, "input.png")
            with open(input_path, "wb") as f:
                f.write(image_bytes)

            bwm = WaterMark(password_img=password_img, password_wm=password_wm)

            if mode == "str":
                if wm_shape is None:
                    return {"success": False, "error": "wm_shape (bit length) is required for mode='str'"}
                result = bwm.extract(filename=input_path, wm_shape=wm_shape, mode="str")
                return {"success": True, "mode": "str", "watermark": result}

            elif mode == "img":
                if wm_shape_w is None or wm_shape_h is None:
                    return {"success": False, "error": "wm_shape_w and wm_shape_h are required for mode='img'"}
                output_path = os.path.join(tmpdir, "extracted_wm.png")
                bwm.extract(
                    filename=input_path,
                    wm_shape=(wm_shape_w, wm_shape_h),
                    out_wm_name=output_path,
                    mode="img",
                )
                with open(output_path, "rb") as f:
                    result_bytes = f.read()
                image_base64 = base64.b64encode(result_bytes).decode("utf-8")
                return {"success": True, "mode": "img", "watermark": image_base64}

            elif mode == "bit":
                if wm_shape is None:
                    return {"success": False, "error": "wm_shape (bit length) is required for mode='bit'"}
                result = bwm.extract(filename=input_path, wm_shape=wm_shape, mode="bit")
                bits = [int(b) for b in result]
                return {"success": True, "mode": "bit", "watermark": bits}

            else:
                return {"success": False, "error": f"Unsupported mode: {mode}"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def get_capacity_sync(image_bytes: bytes, password_img: int) -> dict:
    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            input_path = os.path.join(tmpdir, "input.png")
            with open(input_path, "wb") as f:
                f.write(image_bytes)

            img = cv2.imread(input_path)
            if img is None:
                return {"success": False, "error": "Failed to read image"}

            h, w = img.shape[:2]
            capacity = (h // 2 // 4) * (w // 2 // 4)
            return {"success": True, "capacity": capacity}
    except Exception as e:
        return {"success": False, "error": str(e)}
