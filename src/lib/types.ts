export type Category = "Roads" | "Water Supply" | "Electricity" | "Sanitation" | "Transport" | "Others";
export type Priority = "High" | "Medium" | "Low";
export type Status = "Pending" | "In Progress" | "Resolved";

export interface Complaint {
  id: string;
  name: string;
  text: string;
  location: string;
  imageUrl?: string;
  category: Category;
  priority: Priority;
  status: Status;
  date: string;
}
