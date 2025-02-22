"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createTask } from "@/api/tasks"; // Ensure API function exists
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskAddModal({
  open,
  onClose,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  projectId: number | null;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [manualProjectId, setManualProjectId] = useState(""); // Used if projectId is null
  const [assignees, setAssignees] = useState("");
  const [labels, setLabels] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isRepetitive, setIsRepetitive] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("Weekly");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !body) {
      alert("Please fill in all required fields.");
      return;
    }
    const finalProjectId =
      projectId !== null ? projectId : parseInt(manualProjectId);

    if (!finalProjectId) {
      alert("Please enter a valid Project ID.");
      return;
    }

    setLoading(true);
    try {
      await createTask({
        title,
        body,
        projectId: finalProjectId,
        assignees: assignees ? assignees.split(",") : [],
        labels: labels ? labels.split(",") : [],
        is_active: isActive,
        is_repetitive: isRepetitive,
        repeat_frequency: isRepetitive
          ? (repeatFrequency as "Weekly" | "Fortnightly" | "Monthly")
          : undefined,
      });

      alert("✅ Task Created Successfully!");
      onClose();
    } catch (error) {
      console.error("❌ Error creating task:", error);
      alert("Error creating task. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        {projectId === null && (
          <Input
            placeholder="Project ID"
            value={manualProjectId}
            onChange={(e) => setManualProjectId(e.target.value)}
            className="mb-2"
          />
        )}

        <Input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Task Description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Assignees (comma separated)"
          value={assignees}
          onChange={(e) => setAssignees(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Labels (comma separated)"
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          className="mb-2"
        />

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
          <Select
            value={repeatFrequency}
            onValueChange={(value) =>
              setRepeatFrequency(value as "Weekly" | "Fortnightly" | "Monthly")
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Fortnightly">Fortnightly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
