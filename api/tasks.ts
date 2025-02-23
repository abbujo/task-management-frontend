import apiClient from "@/lib/apiClient";

export type Task = {
  id: number;
  projectId: number;
  title: string;
  body: string;
  assignees: string[];
  labels: string[];
  is_active: boolean;
  is_repetitive: boolean;
  repeat_frequency?: "Weekly" | "Fortnightly" | "Monthly" | null | undefined;
};

export const fetchTasksByProject = async (
  projectId: number
): Promise<Task[]> => {
  try {
    console.log(`📡 Fetching tasks for project ID: ${projectId}...`);
    const response = await apiClient.get("/tasks");
    const filteredTasks = response.data.filter(
      (task: Task) => task.projectId === projectId
    );
    console.log("✅ Tasks fetched:", filteredTasks);
    return filteredTasks;
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    throw error;
  }
};

export const fetchTasks = async () => {
  try {
    console.log("📡 Fetching tasks...");
    const response = await apiClient.get("/tasks");
    console.log("✅ Tasks fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (task: {
  title: string;
  body: string;
  assignees: string[];
  labels: string[];
  projectId: number;
  is_active: boolean;
  is_repetitive: boolean;
  repeat_frequency?: "Weekly" | "Fortnightly" | "Monthly"| null | undefined;
}) => {
  try {
    console.log("📡 Creating task...", task);
    const response = await apiClient.post("/tasks", task);
    console.log("✅ Task created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (
  id: number,
  updatedTask: {
    title?: string;
    body?: string;
    projectId?: number; // ✅ Add this to allow project updates
    assignees?: string[];
    labels?: string[];
    is_active?: boolean;
    is_repetitive?: boolean;
    repeat_frequency?: "Weekly" | "Fortnightly" | "Monthly"| null | undefined;
  }
) => {
  try {
    console.log(`📡 Updating task ID: ${id}`, updatedTask);
    const response = await apiClient.put(`/tasks/${id}`, updatedTask);
    console.log("✅ Task updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating task ID: ${id}`, error);
    throw error;
  }
};

export const deleteTask = async (id: number) => {
  try {
    console.log(`📡 Deleting task ID: ${id}`);
    const response = await apiClient.delete(`/tasks/${id}`);
    console.log("✅ Task deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting task ID: ${id}`, error);
    throw error;
  }
};
