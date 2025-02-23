"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";

interface Task {
  id: number;
  title: string;
  projectId: number;
  body: string;
  assignees: string[];
  labels: string[];
  is_active: boolean;
  is_repetitive: boolean;
  repeat_frequency: "Weekly" | "Fortnightly" | "Monthly";
}


export default function TaskViewModal({ open, onClose, task }: { open: boolean; onClose: () => void; task: Task }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        <p><strong>Title:</strong> {task.title}</p>
        <p><strong>Description:</strong> {task.body}</p>
        <p><strong>Assignees:</strong> {task.assignees.join(", ")}</p>
        <p><strong>Labels:</strong> {task.labels.join(", ")}</p>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
