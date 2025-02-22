import apiClient from "@/lib/apiClient";

export type Project = {
    id: number;
    name: string;
    slug: string;
    description: string;
    project_url: string;
  };

export const fetchProjects = async () => {
  try {
    console.log("📡 Fetching projects...");
    const response = await apiClient.get("/projects");
    console.log("✅ Projects fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    throw error;
  }
};

export const createProject = async (project: {
  name: string;
  slug: string;
  description: string;
  project_url: string;
}) => {
  try {
    console.log("📡 Creating project...", project);
    const response = await apiClient.post("/projects", project);
    console.log("✅ Project created:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating project:", error);
    throw error;
  }
};

export const updateProject = async (slug: string, updatedProject: {
  name?: string;
  description?: string;
  project_url?: string;
}) => {
  try {
    console.log(`📡 Updating project: ${slug}`, updatedProject);
    const response = await apiClient.put(`/projects/${slug}`, updatedProject);
    console.log("✅ Project updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating project: ${slug}`, error);
    throw error;
  }
};

export const deleteProject = async (slug: string) => {
  try {
    console.log(`📡 Deleting project: ${slug}`);
    const response = await apiClient.delete(`/projects/${slug}`);
    console.log("✅ Project deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting project: ${slug}`, error);
    throw error;
  }
};
