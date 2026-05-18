import { todos } from "./state.js";
import { fmt } from "./state.js";
import {
  projectSearch,
  projectList,
  projectCount,
  emptyState,
  taskViewHeader,
  progressRow,
  addTaskRow,
  taskList,
  taskEmpty,
  taskViewTitle,
  taskViewMeta,
  progressFill,
  progressLabel,
} from "./refs.js";
import { escHtml } from "./utils.js";
import { selectProject } from "./project.js";
import { toggleTask, openTaskModal } from "./tasks.js";

export function render() {
  renderProjects();
  renderTaskView();
}

export function renderProjects() {
  const query = projectSearch.value.toLowerCase().trim();
  const filtered = todos.projects.filter((p) =>
    p.name.toLowerCase().includes(query),
  );
  projectList.innerHTML = "";
  filtered.forEach((p) => {
    const taskCount = todos.tasks.filter((t) => t.projectId === p.id).length;
    const li = document.createElement("div");
    li.className =
      "project-item" + (p.id === todos.activeProjectId ? " active" : "");
    li.setAttribute("role", "listitem");
    li.dataset.id = p.id;
    li.innerHTML = `
        <span class="project-dot" style="background:${p.color}"></span>
        <span class="project-name">${escHtml(p.name)}</span>
        <span class="project-badge">${taskCount}</span>
      `;
    li.addEventListener("click", () => selectProject(p.id));
    projectList.appendChild(li);
  });
  const lengthProject = todos.projects.length;
  projectCount.textContent =
    lengthProject === 1 ? "1 project" : `${lengthProject} projects`;
}

export function renderTaskView() {
  const project = todos.projects.find((p) => p.id === todos.activeProjectId);
  if (!project) {
    emptyState.classList.remove("hidden");
    taskViewHeader.hidden = true;
    addTaskRow.hidden = true;
    progressRow.hidden = true;
    taskList.hidden = true;
    taskEmpty.hidden = true;
    return;
  }
  emptyState.classList.add("hidden");
  taskViewHeader.hidden = false;
  addTaskRow.hidden = false;
  progressRow.hidden = false;
  taskList.hidden = false;
  taskViewTitle.textContent = project.name;

  const allTasks = todos.tasks.filter(
    (t) => t.projectId === todos.activeProjectId,
  );
  const doneTasks = allTasks.filter((t) => t.done);
  const pct = allTasks.length
    ? Math.round((doneTasks.length / allTasks.length) * 100)
    : 0;

  taskViewMeta.textContent = `${allTasks.length} task${allTasks.length !== 1 ? "s" : ""} · ${doneTasks.length} done`;
  progressFill.style.width = pct + "%";
  progressLabel.textContent = pct + "%";

  // Filter
  let visible = allTasks;
  if (todos.filter === "pending") {
    visible = allTasks.filter((t) => !t.done);
  }
  if (todos.filter === "done") {
    visible = allTasks.filter((t) => t.done);
  }

  taskList.innerHTML = "";
  visible.forEach((t) => {
    const li = document.createElement("li");
    li.className = "task-item" + (t.done ? " done" : "");
    li.dataset.id = t.id;
    li.innerHTML = `
      <div class="task-checkbox" aria-hidden="true"><i class="ti ti-check"></i></div>
      <span class="task-text">${escHtml(t.text)}</span>
      <span class="task-date">${fmt(t.createdAt)}</span>`;
    li.querySelector(".task-checkbox").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTask(t.id);
    });
    li.addEventListener("click", () => openTaskModal(t.id));
    taskList.appendChild(li);
  });
  const noTask = allTasks.length === 0;
  const noVisible = visible.length === 0 && !noTask;
  taskEmpty.hidden = !(noTask || noVisible);
  taskEmpty.querySelector("p").textContent = noTask
    ? "No tasks yet - add one above"
    : "No tasks match this filter";
}
