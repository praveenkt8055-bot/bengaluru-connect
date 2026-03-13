import { Complaint, Status } from "./types";

const STORAGE_KEY = "grievance_complaints";

const sampleComplaints: Complaint[] = [
  { id: "GRV-001", name: "Rajesh Kumar", text: "There are many potholes on the road near Whitefield bus stop causing danger to commuters.", location: "Whitefield", category: "Roads", priority: "High", status: "Pending", date: "2026-03-10" },
  { id: "GRV-002", name: "Priya Sharma", text: "No water supply for the past 3 days in our area.", location: "Koramangala", category: "Water Supply", priority: "Medium", status: "In Progress", date: "2026-03-11" },
  { id: "GRV-003", name: "Amit Patel", text: "Garbage not collected for a week. Terrible smell and mosquitoes.", location: "Indiranagar", category: "Sanitation", priority: "Medium", status: "Pending", date: "2026-03-11" },
  { id: "GRV-004", name: "Sneha Reddy", text: "Street lights not working on MG Road for the past month.", location: "MG Road", category: "Electricity", priority: "Low", status: "Resolved", date: "2026-03-09" },
  { id: "GRV-005", name: "Mohammed Iqbal", text: "Bus route 500 has been cancelled without notice. Emergency for daily commuters.", location: "Majestic", category: "Transport", priority: "High", status: "Pending", date: "2026-03-12" },
  { id: "GRV-006", name: "Lakshmi Devi", text: "Broken water pipe flooding the entire street. Danger to pedestrians.", location: "Jayanagar", category: "Water Supply", priority: "High", status: "In Progress", date: "2026-03-12" },
  { id: "GRV-007", name: "Karthik Narayan", text: "Transformer explosion near school. Very dangerous for children.", location: "HSR Layout", category: "Electricity", priority: "High", status: "Pending", date: "2026-03-13" },
  { id: "GRV-008", name: "Deepa Gowda", text: "Open drainage on the main road causing accidents.", location: "BTM Layout", category: "Sanitation", priority: "High", status: "Pending", date: "2026-03-13" },
];

function loadComplaints(): Complaint[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleComplaints));
  return sampleComplaints;
}

function saveComplaints(complaints: Complaint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
}

export function getComplaints(): Complaint[] {
  return loadComplaints();
}

export function addComplaint(complaint: Complaint) {
  const complaints = loadComplaints();
  complaints.unshift(complaint);
  saveComplaints(complaints);
}

export function updateComplaintStatus(id: string, status: Status) {
  const complaints = loadComplaints();
  const idx = complaints.findIndex((c) => c.id === id);
  if (idx !== -1) {
    complaints[idx].status = status;
    saveComplaints(complaints);
  }
}

export function generateId(): string {
  const complaints = loadComplaints();
  return `GRV-${String(complaints.length + 1).padStart(3, "0")}`;
}
