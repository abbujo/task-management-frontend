"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProjects, Project } from "@/api/projects";
import { fetchTasksByProject, Task } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Eye, Edit, Trash } from "lucide-react"; // Icons

// Import Modals
import TaskAddModal from "@/components/ui/tasks/TaskAddModal";
import TaskEditModal from "@/components/ui/tasks/TaskEditModal";
import TaskDeleteModal from "@/components/ui/tasks/TaskDeleteModal";
import TaskViewModal from "@/components/ui/tasks/TaskViewModal";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<number | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const slug = params?.slug as string;
    fetchProjects().then((projects) => {
      const selectedProject = projects.find((p: Project) => p.slug === slug);
      if (selectedProject) {
        setProject(selectedProject);
        fetchTasksByProject(selectedProject.id).then(setTasks);
      }
      setLoading(false);
    });
  }, [params.slug]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96 mb-2" />
        <Skeleton className="h-24 w-full max-w-md mb-4" />
      </div>
    );
  }

  if (!project) {
    return <div className="p-6 text-red-500">❌ Project not found.</div>;
  }

  // Filtered tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      {project.project_url && (
        <a
          href={project.project_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline mb-4"
        >
          View Project →
        </a>
      )}

      {/* Search & Add Task Section */}
      <div className="flex w-full max-w-3xl justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mr-4"
        />
        <Button size="sm" onClick={() => setAddTaskModal(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-1" /> Add Task
        </Button>
      </div>

      {/* Tasks Table */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Tasks for this Project</h2>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="w-full max-w-3xl">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Task</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr key={task.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2 truncate max-w-[200px]">{task.body}</td>
                  <td className="px-4 py-2 flex justify-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => setViewTask(task)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditTask(task)}>
                      <Edit className="h-4 w-4 text-yellow-500" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setDeleteTask(task.id)}
                      className="text-red-500 bg-transparent hover:bg-red-100"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Button onClick={() => router.push("/projects")} className="mt-6">
        ← Back to Projects
      </Button>

      {/* Modals */}
      <TaskAddModal open={addTaskModal} onClose={() => setAddTaskModal(false)} projectId={project.id} />
      {editTask && <TaskEditModal open={!!editTask} onClose={() => setEditTask(null)} task={editTask} />}
      {deleteTask && <TaskDeleteModal open={!!deleteTask} onClose={() => setDeleteTask(null)} taskId={deleteTask} />}
      {viewTask && <TaskViewModal open={!!viewTask} onClose={() => setViewTask(null)} task={viewTask} />}
    </div>
  );
}
