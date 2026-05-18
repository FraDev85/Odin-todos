import {
  modalClose,
  modalDelete,
  modalOverlay,
  modalSave,
  projectSearch,
  statusCompleted,
  statusPending,
  btnNewProject,
  btnEditProject,
  btnDeleteProject,
  projectModalSave,
  projectModalCancel,
  projectModalClose,
  projectNameInput,
  projectModal,
  addTaskInput,
} from "./refs.js";
import { todos } from "./state.js";
import {
  openNewProjectModal,
  openEditProjectModal,
  deleteProject,
  saveProject,
} from "./project.js";

import { addTask } from "./tasks.js";
import { renderTaskView } from "./render.js";
import { saveTask, deleteTask } from "./tasks.js";
import { renderProjects } from "./render.js";

btnNewProject.addEventListener("click", openNewProjectModal);
btnEditProject.addEventListener("click", openEditProjectModal);
btnDeleteProject.addEventListener("click", deleteProject);

// Project modal
projectModalSave.addEventListener("click", saveProject);
projectModalCancel.addEventListener("click", () => {
  projectModal.hidden = true;
});
projectModalClose.addEventListener("click", () => {
  projectModal.hidden = true;
});
projectNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") saveProject();
});
projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal) projectModal.hidden = true;
});

// Add task
addTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask(addTaskInput.value);
    addTaskInput.value = "";
  }
});

// Filter buttons
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    todos.filter = btn.dataset.filter;
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTaskView();
  });
});

// Task modal
modalSave.addEventListener("click", saveTask);
modalDelete.addEventListener("click", deleteTask);
modalClose.addEventListener("click", () => {
  modalOverlay.hidden = true;
});
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.hidden = true;
});

// Status toggle
statusPending.addEventListener("click", () => {
  statusPending.classList.add("active");
  statusCompleted.classList.remove("active");
});
statusCompleted.addEventListener("click", () => {
  statusCompleted.classList.add("active");
  statusPending.classList.remove("active");
});

// Project search
projectSearch.addEventListener("input", renderProjects);

// Keyboard: Escape closes modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modalOverlay.hidden = true;
    projectModal.hidden = true;
  }
});
