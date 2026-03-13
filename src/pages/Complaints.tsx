import { useState, useMemo } from "react";
import { toast } from "sonner";
import { getComplaints, updateComplaintStatus } from "@/lib/store";
import { PriorityBadge, StatusBadge } from "@/components/Badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import type { Status, Complaint } from "@/lib/types";

export default function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>(getComplaints());
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch = c.text.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "all" || c.category === filterCategory;
      const matchesStatus = filterStatus === "all" || c.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [complaints, search, filterCategory, filterStatus]);

  const handleStatusChange = (id: string, status: Status) => {
    updateComplaintStatus(id, status);
    setComplaints(getComplaints());
    toast.success(`Complaint ${id} updated to ${status}`);
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Complaint Management</h1>
        <p className="mt-1 text-muted-foreground">{complaints.length} total complaints • {filtered.length} shown</p>
      </div>

      <Card className="mb-6 shadow-card">
        <CardContent className="flex flex-wrap gap-3 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Roads">Roads</SelectItem>
              <SelectItem value="Water Supply">Water Supply</SelectItem>
              <SelectItem value="Electricity">Electricity</SelectItem>
              <SelectItem value="Sanitation">Sanitation</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-card overflow-hidden">
        <CardHeader><CardTitle>Complaints</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{c.category}</span>
                    </TableCell>
                    <TableCell className="hidden max-w-[200px] truncate md:table-cell text-sm text-muted-foreground">{c.text}</TableCell>
                    <TableCell className="text-sm">{c.location}</TableCell>
                    <TableCell><PriorityBadge priority={c.priority} /></TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.date}</TableCell>
                    <TableCell>
                      <Select value={c.status} onValueChange={(v) => handleStatusChange(c.id, v as Status)}>
                        <SelectTrigger className="h-8 w-[120px] text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No complaints found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
