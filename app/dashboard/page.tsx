"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchGitHubUser } from "@/lib/githubUser";
import ProjectModal from "@/components/ui/ProjectModal";
import TaskAddModal from "@/components/ui/tasks/TaskAddModal";
import { Card, CardContent } from "@/components/ui/card";

interface GitHubUser {
  avatar_url: string;
  name: string;
  login: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<GitHubUser|null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("github_token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchGitHubUser(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("github_token");
        router.push("/login");
      });
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      {/* Welcome Banner */}
      <div className="max-w-3xl text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Manage your projects and tasks efficiently.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Card
          className="cursor-pointer hover:shadow-lg"
          onClick={() => router.push("/projects")}
        >
          <CardContent className="flex flex-col items-center justify-center py-6">
            <h3 className="text-lg font-semibold">Manage Projects</h3>
            <p className="text-sm text-gray-500">
              Create, update, and organize your projects.
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg"
          onClick={() => router.push("/tasks")}
        >
          <CardContent className="flex flex-col items-center justify-center py-6">
            <h3 className="text-lg font-semibold">Manage Tasks</h3>
            <p className="text-sm text-gray-500">
              View, assign, and complete tasks seamlessly.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Actions */}
      <div className="flex gap-4 mt-6">
        <Button onClick={() => setProjectModalOpen(true)}>
          + Add New Project
        </Button>
        <Button onClick={() => setTaskModalOpen(true)} variant="outline">
          + Add New Task
        </Button>
      </div>

      {/* Modals */}
      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
      <TaskAddModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        projectId={null}
      />
    </div>
  );
}
