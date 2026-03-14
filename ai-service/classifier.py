import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model_id = "openai/clip-vit-base-patch32"

print(f"Loading CLIP model {model_id} on {device}...")
model = CLIPModel.from_pretrained(model_id).to(device)
processor = CLIPProcessor.from_pretrained(model_id)

CATEGORIES = [
    "Pothole", "Garbage", "Water Leakage", 
    "Street Light Issue", "Drainage Problem", "Road Damage"
]

def verify_and_classify(image: Image.Image, description: str):
    # Compute similarity between image and description
    inputs = processor(
        text=[description], 
        images=image, 
        return_tensors="pt", 
        padding=True
    ).to(device)

    with torch.no_grad():
        image_embeds = model.get_image_features(inputs.pixel_values)
        text_embeds = model.get_text_features(inputs.input_ids)
        
    image_embeds = image_embeds / image_embeds.norm(dim=-1, keepdim=True)
    text_embeds = text_embeds / text_embeds.norm(dim=-1, keepdim=True)
    
    similarity = (image_embeds @ text_embeds.T).item()
    # CLIP similarities are usually between 0.15 and 0.35, scale suitably to 0-100%
    confidenceScore = min(max((similarity - 0.15) * 500, 0), 100) 
    match = confidenceScore > 40
    
    # Classification among CATEGORIES
    cat_inputs = processor(text=CATEGORIES, images=image, return_tensors="pt", padding=True).to(device)
    with torch.no_grad():
        cat_outputs = model(**cat_inputs)
        cat_probs = cat_outputs.logits_per_image.softmax(dim=1)[0].cpu().numpy()
        
    best_idx = cat_probs.argmax()
    best_category = CATEGORIES[best_idx]
    
    # Determine Priority based on category
    priority = "Medium"
    if best_category in ["Pothole", "Water Leakage"]:
        priority = "High"
    elif best_category in ["Drainage Problem", "Road Damage"]:
        priority = "Critical"
    elif best_category == "Street Light Issue":
        priority = "Low"
        
    return {
        "category": best_category,
        "priority": priority,
        "verifyResult": {
            "match": match,
            "confidenceScore": round(confidenceScore, 2)
        }
    }
