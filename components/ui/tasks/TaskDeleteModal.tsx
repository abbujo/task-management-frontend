"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { deleteTask } from "@/api/tasks"; // Ensure API function exists

export default function TaskDeleteModal({ open, onClose, taskId }: { open: boolean; onClose: () => void; taskId: number }) {
  const handleDelete = async () => {
    try {
      await deleteTask(taskId);
      alert("✅ Task Deleted Successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      alert("Error deleting task. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Task Deletion</DialogTitle>
        </DialogHeader>

        <p>Are you sure you want to delete this task? This action cannot be undone.</p>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleDelete} className="text-red-500 bg-transparent hover:bg-red-100">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
