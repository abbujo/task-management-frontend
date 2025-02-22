"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProjects, Project } from "@/api/projects";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProjectModal from "@/components/ui/ProjectModal"; // Import the modal

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects().then(setProjects).catch((error) => {
      console.error("❌ Error fetching projects:", error);
    });
  }, []);

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      
      {/* Add Project Button */}
      <Button onClick={() => setModalOpen(true)} className="mb-4">
        + Add New Project
      </Button>

      {/* Project Creation Modal */}
      <ProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Project List */}
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available.</p>
      ) : (
        projects.map((project) => (
          <Card
            key={project.id}
            className="mb-3 w-full max-w-md cursor-pointer"
            onClick={() => router.push(`/projects/${project.slug}`)}
          >
            <CardContent>
              <h2 className="text-lg font-bold">{project.name}</h2>
              <p>{project.description}</p>

              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 inline-block"
                  onClick={(e) => e.stopPropagation()} // Prevents card click from navigating
                >
                  View Project →
                </a>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
