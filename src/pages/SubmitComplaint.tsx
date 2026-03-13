import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, User, FileText, Upload, Sparkles, Send } from "lucide-react";
import { classifyCategory, detectPriority } from "@/lib/classifier";
import { addComplaint, generateId } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PriorityBadge } from "@/components/Badges";
import type { Category, Priority } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  text: z.string().trim().min(10, "Complaint must be at least 10 characters").max(2000),
  location: z.string().trim().min(1, "Location is required").max(200),
});

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{ category: Category; priority: Priority } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAnalyze = () => {
    if (text.trim().length < 10) {
      toast.error("Enter at least 10 characters to analyze");
      return;
    }
    const category = classifyCategory(text);
    const priority = detectPriority(text);
    setAiResult({ category, priority });
    toast.success(`AI classified as: ${category} (${priority} priority)`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ name, text, location });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const category = classifyCategory(text);
    const priority = detectPriority(text);

    addComplaint({
      id: generateId(),
      name: result.data.name,
      text: result.data.text,
      location: result.data.location,
      imageUrl: imagePreview || undefined,
      category,
      priority,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    });

    toast.success("Complaint submitted successfully!");
    navigate("/complaints");
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Report a Civic Issue</h1>
        <p className="mt-2 text-muted-foreground">Help improve Bengaluru by reporting issues in your area</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
          <CardDescription>Fill in the details below. Our AI will automatically categorize your complaint.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="h-4 w-4 text-primary" /> Your Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Rajesh Kumar" />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="h-4 w-4 text-primary" /> Complaint Description
              </label>
              <Textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setAiResult(null); }}
                placeholder="Describe the issue in detail, e.g., 'There are many potholes on the road near Whitefield bus stop.'"
                rows={4}
              />
              {errors.text && <p className="mt-1 text-xs text-destructive">{errors.text}</p>}
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleAnalyze}>
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Analyze with AI
              </Button>
              {aiResult && (
                <div className="mt-3 flex items-center gap-3 rounded-lg bg-secondary p-3">
                  <span className="text-sm font-medium text-foreground">AI Result:</span>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{aiResult.category}</span>
                  <PriorityBadge priority={aiResult.priority} />
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Location
              </label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Whitefield, Koramangala, MG Road" />
              {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location}</p>}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                <Upload className="h-4 w-4 text-primary" /> Upload Image (Optional)
              </label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />
              )}
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Send className="mr-2 h-4 w-4" /> Submit Complaint
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
