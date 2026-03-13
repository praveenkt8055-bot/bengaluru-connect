import { Priority, Status } from "@/lib/types";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const classes: Record<Priority, string> = {
    High: "bg-destructive text-destructive-foreground",
    Medium: "bg-warning text-warning-foreground",
    Low: "bg-secondary text-secondary-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes[priority]}`}>
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const classes: Record<Status, string> = {
    Pending: "bg-warning/15 text-warning border border-warning/30",
    "In Progress": "bg-info/15 text-info border border-info/30",
    Resolved: "bg-success/15 text-success border border-success/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes[status]}`}>
      {status}
    </span>
  );
}
