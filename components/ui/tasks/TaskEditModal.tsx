"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateTask } from "@/api/tasks"; // Ensure API function exists
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; // Import Badge component

export default function TaskEditModal({
  open,
  onClose,
  task,
}: {
  open: boolean;
  onClose: () => void;
  task: any;
}) {
  const [title, setTitle] = useState(task.title || "");
  const [body, setBody] = useState(task.body || "");
  const [projectId, setProjectId] = useState(task.projectId || "");
  const [assignees, setAssignees] = useState(task.assignees?.join(", ") || "");
  const [labels, setLabels] = useState(task.labels?.join(", ") || "");
  const [labelArray, setLabelArray] = useState<string[]>(task.labels || []);
  const [isActive, setIsActive] = useState(task.is_active || false);
  const [isRepetitive, setIsRepetitive] = useState(task.is_repetitive || false);
  const [repeatFrequency, setRepeatFrequency] = useState(
    task.repeat_frequency || "Weekly"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(task.title || "");
    setBody(task.body || "");
    setProjectId(task.projectId || "");
    setAssignees(task.assignees?.join(", ") || "");
    setLabels(task.labels?.join(", ") || "");
    setLabelArray(task.labels || []);
    setIsActive(task.is_active || false);
    setIsRepetitive(task.is_repetitive || false);
    setRepeatFrequency(task.repeat_frequency || "Weekly");
  }, [task]);

  // Handle label input change and update the badge list
  const handleLabelsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabels = e.target.value;
    setLabels(newLabels);
    setLabelArray(newLabels.split(",").map((label) => label.trim()));
  };

  const handleSubmit = async () => {
    if (!title || !body || !projectId) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await updateTask(task.id, {
        title,
        body,
        projectId: parseInt(projectId),
        assignees: assignees ? assignees.split(",") : [],
        labels: labels ? labels.split(",") : [],
        is_active: isActive,
        is_repetitive: isRepetitive,
        repeat_frequency: isRepetitive
          ? (repeatFrequency as "Weekly" | "Fortnightly" | "Monthly")
          : undefined,
      });

      alert("✅ Task Updated Successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Error updating task:", error);
      alert("Error updating task. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Task Title</label>
          <Input
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Task Description</label>
          <Input
            placeholder="Enter task description"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Project ID</label>
          <Input
            placeholder="Enter project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Assignees (comma separated)</label>
          <Input
            placeholder="Enter assignees"
            value={assignees}
            onChange={(e) => setAssignees(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Labels (comma separated)</label>
          <Input
            placeholder="Enter labels"
            value={labels}
            onChange={handleLabelsChange}
          />
          <div className="flex flex-wrap gap-2">
            {labelArray.map((label, index) => (
              <Badge key={index} className="bg-blue-500 text-white">
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Task Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="active"
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(!!checked)}
          />
          <label htmlFor="active" className="text-sm cursor-pointer">
            Is this task active?
          </label>
        </div>

        {/* Repetitive Task Checkbox */}
        <div className="flex items-center gap-2 mt-2">
          <Checkbox
            id="repetitive"
            checked={isRepetitive}
            onCheckedChange={(checked) => setIsRepetitive(!!checked)}
          />
          <label htmlFor="repetitive" className="text-sm cursor-pointer">
            Is this task repetitive?
          </label>
        </div>

        {/* Repeat Frequency Dropdown */}
        {isRepetitive && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Repeat Frequency</label>
            <Select
              value={repeatFrequency}
              onValueChange={(value) =>
                setRepeatFrequency(value as "Weekly" | "Fortnightly" | "Monthly")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Fortnightly">Fortnightly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
