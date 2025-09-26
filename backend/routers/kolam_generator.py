from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from routers.kolam_generator_model import generate_kolam_png_base64, compute_insights


class GenerateRequest(BaseModel):
    m: int
    n: int
    region: Optional[str] = "Tamil Nadu"
    style: Optional[str] = "Pulli"
    color: Optional[int] = 50  # 0-100
    size: Optional[int] = 32   # 0-100
    complexity: Optional[int] = 75  # 0-100


router = APIRouter(prefix="/api")

@router.post("/generate")
def generate(req: GenerateRequest):
    try:
        if req.m <= 0 or req.n <= 0:
            raise HTTPException(status_code=400, detail="m and n must be positive integers")
        image_b64, svg_text = generate_kolam_png_base64(
            m=req.m,
            n=req.n,
            region=req.region,
            style=req.style,
            color=req.color,
            size=req.size,
            complexity=req.complexity,
        )
        insights = compute_insights(req.m, req.n)
        return {"image_base64": image_b64, "svg": svg_text, "region": req.region, "insights": insights}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

