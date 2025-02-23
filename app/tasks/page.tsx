"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchTasks, Task } from "@/api/tasks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Eye, Edit, Trash } from "lucide-react";
import TaskAddModal from "@/components/ui/tasks/TaskAddModal";
import TaskEditModal from "@/components/ui/tasks/TaskEditModal";
import TaskDeleteModal from "@/components/ui/tasks/TaskDeleteModal";
import TaskViewModal from "@/components/ui/tasks/TaskViewModal";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<number | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
    });
  }, []);

  // Filtered tasks based on search query
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">All Tasks</h1>

      {/* Search & Add Task Section */}
      <div className="flex w-full max-w-3xl justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mr-4"
        />
        <Button
          size="sm"
          onClick={() => setAddTaskModal(true)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Task
        </Button>
      </div>

      {/* Tasks Table */}
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
                <tr
                  key={`${task.id}-${index}`}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2 truncate max-w-[200px]">
                    {task.body}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewTask(task)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditTask(task)}
                    >
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

      <Button onClick={() => router.push("/")} className="mt-6">
        ← Back to Home
      </Button>

      {/* Modals */}
      <TaskAddModal
        open={addTaskModal}
        onClose={() => setAddTaskModal(false)}
        projectId={null}
      />
      {editTask && (
        <TaskEditModal
          open={!!editTask}
          onClose={() => setEditTask(null)}
          task={editTask}
        />
      )}
      {deleteTask && (
        <TaskDeleteModal
          open={!!deleteTask}
          onClose={() => setDeleteTask(null)}
          taskId={deleteTask}
        />
      )}
      {viewTask && (
        <TaskViewModal
          open={!!viewTask}
          onClose={() => setViewTask(null)}
          task={viewTask}
        />
      )}
    </div>
  );
}
