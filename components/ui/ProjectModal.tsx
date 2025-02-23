"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().replace(/\s+/g, "-"));
  };

  const handleSubmit = async () => {
    if (!name || !slug || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Mock API: Simulating project creation...");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock API response
      const mockResponse = {
        id: Math.floor(Math.random() * 1000), // Generate a mock project ID
        name,
        slug,
        description,
        project_url: projectUrl,
      };

      console.log("✅ Mock API Response:", mockResponse);
      alert("✅ Project Created (Mocked)!");
      onClose(); // Close modal
    } catch (error) {
      console.error("❌ Mock API Error:", error);
      alert("Error creating project. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project (Mock API)</DialogTitle>
        </DialogHeader>

        {/* Input Fields */}
        <Input
          placeholder="Project Name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="mb-2"
        />
        <Input placeholder="Project Slug" value={slug} disabled className="mb-2" />
        <Input
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="Project URL (optional)"
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
          className="mb-2"
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
