import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.watermark import router as watermark_router

app = FastAPI(title="Blind Watermark API")

cors_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(watermark_router)


@app.get("/")
async def root():
    return {"message": "Blind Watermark API"}
