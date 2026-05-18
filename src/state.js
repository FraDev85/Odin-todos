export const STORAGE_KEY = "doit_data_v2";

export let todos = {
  projects: [],
  tasks: [],
  activeProjectId: null,
  filter: "all",
  editingTaskId: null,
  editProjectId: null,
};

export const COLORS = [
  "#C0614A",
  "#7B9E6B",
  "#D4956A",
  "#6A9DBE",
  "#A07CBE",
  "#BE8A6A",
  "#5A9E8A",
  "#BE6A7C",
  "#9B7B65",
  "#8AAA6A",
];

/* persist  */

export function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ projects: todos.projects, tasks: todos.tasks }),
  );
}

export function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    todos.projects = data.projects || [];
    todos.tasks = data.tasks || [];
  } catch (_) {
    console.log("error to restore data");
  }
}

/* helpers  */
export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function fmt(ts) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ts));
}
