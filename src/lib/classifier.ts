import { Category, Priority } from "./types";

const categoryKeywords: Record<Category, string[]> = {
  Roads: ["road", "pothole", "highway", "street", "lane", "bridge", "footpath", "pavement", "tar", "asphalt", "divider", "speed breaker", "signal"],
  "Water Supply": ["water", "pipe", "leak", "tap", "supply", "drainage", "sewage", "borewell", "tanker", "contaminated"],
  Electricity: ["electricity", "power", "transformer", "wire", "pole", "outage", "blackout", "voltage", "meter", "electric", "current", "light"],
  Sanitation: ["garbage", "waste", "trash", "dump", "clean", "hygiene", "toilet", "sanitation", "smell", "stink", "mosquito", "pest", "rat"],
  Transport: ["bus", "metro", "train", "auto", "rickshaw", "traffic", "transport", "parking", "vehicle", "cab", "fare"],
  Others: [],
};

const urgentKeywords = ["danger", "accident", "emergency", "broken", "flood", "collapse", "death", "fire", "hazard", "urgent", "critical", "life-threatening", "injured"];

export function classifyCategory(text: string): Category {
  const lower = text.toLowerCase();
  let bestCategory: Category = "Others";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === "Others") continue;
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as Category;
    }
  }

  return bestCategory;
}

export function detectPriority(text: string): Priority {
  const lower = text.toLowerCase();
  const urgentCount = urgentKeywords.filter((kw) => lower.includes(kw)).length;
  if (urgentCount >= 2) return "High";
  if (urgentCount === 1) return "Medium";
  return "Low";
}
