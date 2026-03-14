from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from PIL import Image
from classifier import verify_and_classify

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/verify")
async def verify_complaint(
    description: str = Form(...),
    image: UploadFile = File(...)
):
    contents = await image.read()
    pil_image = Image.open(BytesIO(contents)).convert("RGB")
    
    result = verify_and_classify(pil_image, description)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
