import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

// Detect environment
const ENV = process.env.NEXT_PUBLIC_ENV || "development";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
});

// Mock Data (Used Only in Development)
const mockData = {
    projects: [
      {
        id: 1,
        name: "Project Alpha",
        slug: "project-alpha",
        description: "First project",
        project_url: "https://github.com/example/project-alpha",
      },
      {
        id: 2,
        name: "Project Beta",
        slug: "project-beta",
        description: "Second project",
        project_url: "https://github.com/example/project-beta",
      },
    ],
    tasks: [
      {
        id: 1,
        projectId: 1, // Links to Project Alpha
        title: "Task 1",
        body: "Task 1 Description",
        assignees: ["user1"],
        labels: ["bug"],
        is_active: true,
        is_repetitive: false,
      },
      {
        id: 2,
        projectId: 1, // Links to Project Alpha
        title: "Task XYZ",
        body: "Task XYZ Description",
        assignees: ["user1"],
        labels: ["bug"],
        is_active: true,
        is_repetitive: false,
      },
      {
        id: 3,
        projectId: 1, // Links to Project Alpha
        title: "Task XY",
        body: "Task XY Description",
        assignees: ["user1"],
        labels: ["bug"],
        is_active: true,
        is_repetitive: false,
      },
      {
        id: 2,
        projectId: 2, // Links to Project Beta
        title: "Task 2",
        body: "Task 2 Description",
        assignees: ["user2"],
        labels: ["feature"],
        is_active: true,
        is_repetitive: true,
        repeat_frequency: "Weekly",
      },
    ],
  };
  

// Apply mocks only in development
if (ENV === "development") {
  console.log("🛠️ Mock API enabled");

  const mock = new AxiosMockAdapter(apiClient, { delayResponse: 500 });

  // 📌 GET: Fetch all projects
  mock.onGet("/projects").reply(200, mockData.projects);

  // 📌 POST: Create a new project
  mock.onPost("/projects").reply((config) => {
    const newProject = JSON.parse(config.data);
    newProject.id = mockData.projects.length + 1;
    mockData.projects.push(newProject);
    console.log("🆕 Project created:", newProject);
    return [201, newProject];
  });

  // 📌 PUT: Update an existing project
  mock.onPut(/\/projects\/.+/).reply((config) => {
    const updatedProject = JSON.parse(config.data);
    const slug = config.url?.split("/").pop(); // Extract slug
    const index = mockData.projects.findIndex((p) => p.slug === slug);

    if (index === -1) return [404, { error: "Project not found" }];

    mockData.projects[index] = { ...mockData.projects[index], ...updatedProject };
    console.log("✏️ Project updated:", mockData.projects[index]);
    return [200, mockData.projects[index]];
  });

  // 📌 DELETE: Remove a project
  mock.onDelete(/\/projects\/.+/).reply((config) => {
    const slug = config.url?.split("/").pop(); // Extract slug
    const index = mockData.projects.findIndex((p) => p.slug === slug);

    if (index === -1) return [404, { error: "Project not found" }];

    mockData.projects.splice(index, 1);
    console.log("🗑️ Project deleted:", slug);
    return [200, { success: true }];
  });

  // 📌 GET: Fetch all tasks
  mock.onGet("/tasks").reply(200, mockData.tasks);

  // 📌 POST: Create a new task
  mock.onPost("/tasks").reply((config) => {
    const newTask = JSON.parse(config.data);
    newTask.id = mockData.tasks.length + 1;
    mockData.tasks.push(newTask);
    console.log("🆕 Task created:", newTask);
    return [201, newTask];
  });

  // 📌 PUT: Update an existing task
  mock.onPut(/\/tasks\/\d+/).reply((config) => {
    const updatedTask = JSON.parse(config.data);
    const id = parseInt(config.url?.split("/").pop() || "-1", 10);
    const index = mockData.tasks.findIndex((t) => t.id === id);

    if (index === -1) return [404, { error: "Task not found" }];

    mockData.tasks[index] = { ...mockData.tasks[index], ...updatedTask };
    console.log("✏️ Task updated:", mockData.tasks[index]);
    return [200, mockData.tasks[index]];
  });

  // 📌 DELETE: Remove a task
  mock.onDelete(/\/tasks\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split("/").pop() || "-1", 10);
    const index = mockData.tasks.findIndex((t) => t.id === id);

    if (index === -1) return [404, { error: "Task not found" }];

    mockData.tasks.splice(index, 1);
    console.log("🗑️ Task deleted:", id);
    return [200, { success: true }];
  });

  console.log("✅ Mock routes set up: /projects, /tasks (CRUD)");
}

export default apiClient;
