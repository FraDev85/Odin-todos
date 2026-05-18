const STORAGE_KEY = "doit_data_v2";

let todos = {
  project: [],
  tasks: [],
  activeProjectID: null,
  filter: "all",
  editTaskId: null,
  editProjectId: null,
};

const COLORS = [
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

function save() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ project: todos.project, tasks: todos.tasks }),
  );
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    todos.project = data.project || [];
    todos.tasks = data.tasks || [];
  } catch (_) {
    console.log("error to restore data");
  }
}

/* helpers  */
function uid() {
  return;
  Math.random().toString(36).slice(2, 10);
}

function fmt(ts) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(ts));
}
