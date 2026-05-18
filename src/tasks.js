import {
  modalNotes,
  modalText,
  modalCreated,
  statusCompleted,
  statusPending,
  modalOverlay,
} from "./refs.js";
import { save } from "./state.js";
import { render } from "./render.js";
import { fmt } from "./state.js";
import { todos } from "./state.js";
import { uid } from "./state.js";

export function addTask(text) {
  if (!todos.activeProjectId || !text.trim()) return;
  todos.tasks.push({
    id: uid(),
    projectId: todos.activeProjectId,
    text: text.trim(),
    notes: "",
    done: false,
    createdAt: Date.now(),
  });
  save();
  render();
}

export function toggleTask(id) {
  const t = todos.tasks.find((t) => t.id === id);
  if (t) {
    t.done = !t.done;
    save();
    render();
  }
}

export function openTaskModal(id) {
  const t = todos.tasks.find((t) => t.id === id);
  if (!t) return;
  todos.editingTaskId = id;
  modalText.value = t.text;
  modalNotes.value = t.notes || "";
  modalCreated.textContent = "Created " + fmt(t.createdAt);
  statusPending.classList.toggle("active", !t.done);
  statusCompleted.classList.toggle("active", t.done);
  modalOverlay.hidden = false;
  modalText.focus();
}

export function saveTask() {
  const t = todos.tasks.find((t) => t.id === todos.editingTaskId);
  if (!t) return;
  const text = modalText.value.trim();
  if (!text) {
    modalText.focus();
    return;
  }
  t.text = text;
  t.notes = modalNotes.value.trim();
  t.done = statusCompleted.classList.contains("active");
  modalOverlay.hidden = true;
  todos.editingTaskId = null;
  save();
  render();
}

export function deleteTask() {
  todos.tasks = todos.tasks.filter((t) => t.id !== todos.editingTaskId);
  modalOverlay.hidden = true;
  todos.editingTaskId = null;
  save();
  render();
}
