import { render } from "./render.js";
import { projectModalTitle, projectNameInput } from "./refs.js";
import { save, todos, COLORS } from "./state.js";
import { uid } from "./state.js";
import { colorPicker, projectModal } from "./refs.js";

export function selectProject(id) {
  todos.activeProjectId = id;
  todos.filter = "all";
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.filter === "all"));
  render();
}

export function openNewProjectModal() {
  todos.editProjectId = null;
  projectModalTitle.textContent = "New Project";
  projectNameInput.value = "";
  renderColorPicker(COLORS[0]);
  projectModal.hidden = false;
  projectNameInput.focus();
}

export function openEditProjectModal() {
  const p = todos.projects.find((p) => p.id === todos.activeProjectId);
  if (!p) return;
  todos.editProjectId = p.id;
  projectModalTitle.textContent = "Rename Project";
  projectNameInput.value = p.name;
  renderColorPicker(p.color);
  projectModal.hidden = false;
  projectNameInput.focus();
}

export function saveProject() {
  const name = projectNameInput.value.trim();
  if (!name) {
    projectNameInput.focus();
    return;
  }
  const color =
    colorPicker.querySelector(".selected")?.style.background || COLORS[0];

  if (todos.editProjectId) {
    const p = todos.projects.find((p) => p.id === todos.editProjectId);
    if (p) {
      p.name = name;
      p.color = color;
    }
  } else {
    const p = { id: uid(), name, color };
    todos.projects.push(p);
    todos.activeProjectId = p.id;
  }
  projectModal.hidden = true;
  save();
  render();
}

export function deleteProject() {
  if (!todos.activeProjectId) return;
  if (!confirm("Delete this project and all its tasks?")) return;
  todos.tasks = todos.tasks.filter(
    (t) => t.projectId !== todos.activeProjectId,
  );
  todos.projects = todos.projects.filter((p) => p.id !== todos.activeProjectId);
  todos.activeProjectId = todos.projects[0]?.id ?? null;
  save();
  render();
}

export function renderColorPicker(selectedColor) {
  colorPicker.innerHTML = "";
  COLORS.forEach((c) => {
    const sw = document.createElement("button");
    sw.className = "color-swatch" + (c === selectedColor ? " selected" : "");
    sw.style.background = c;
    sw.setAttribute("aria-label", c);
    sw.type = "button";
    sw.addEventListener("click", () => {
      colorPicker
        .querySelectorAll(".color-swatch")
        .forEach((s) => s.classList.remove("selected"));
      sw.classList.add("selected");
    });
    colorPicker.appendChild(sw);
  });
}
