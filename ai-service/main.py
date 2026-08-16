from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from classifier import process_and_classify_image
import uvicorn
import os

app = FastAPI(
    title="CivicFix AI Image Classifier API",
    description="Microservice for automatically classifying reported municipal issues (potholes, trash, broken streetlights).",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClassificationResponse(BaseModel):
    predicted_category: str
    confidence: float
    recommended_priority: str
    image_dimensions: dict | None = None
    format: str | None = None
    all_scores: dict | None = None

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "CivicFix AI Classifier (FastAPI)"}

@app.post("/classify", response_model=ClassificationResponse)
async def classify_issue_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    result = process_and_classify_image(contents)
    return result

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
