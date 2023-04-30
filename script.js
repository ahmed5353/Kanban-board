"use strict";

const addBtn = document.getElementById("add-button-started");
const addBtnProgress = document.getElementById("add-button-progress");
const addBtnCompleted = document.getElementById("add-button-completed");

addBtn.addEventListener("click", addTaskDOM.bind(null, "not-started"));
addBtnProgress.addEventListener("click", addTaskDOM.bind(null, "in-progress"));
addBtnCompleted.addEventListener("click", addTaskDOM.bind(null, "completed"));

let listOneStore = JSON.parse(localStorage.getItem("listOne"));
let listTwoStore = JSON.parse(localStorage.getItem("listTwo"));
let listThreeStore = JSON.parse(localStorage.getItem("listThree"));

let listOne = listOneStore == null ? [] : listOneStore;
let listTwo = listTwoStore == null ? [] : listTwoStore;
let listThree = listThreeStore == null ? [] : listThreeStore;

function renderTasks(list, parentId) {
  list.forEach((taskObj) => {
    const parentList = document.getElementById(parentId);
    const taskId = taskObj.id;
    const task = addTask(taskId);
    const dropArea = createDropArea(taskId);
    task.querySelector(".input-area").value = taskObj.content;
    parentList.lastElementChild.before(task);
    task.after(dropArea);
  });
}

function popiliateTasks() {
  renderTasks(listOne, "not-started");
  renderTasks(listTwo, "in-progress");
  renderTasks(listThree, "completed");
}

popiliateTasks();

function addTask(id) {
  const task = document.createElement("li");

  task.classList.add("task");
  task.draggable = true;
  task.id = id || generateId();

  task.innerHTML = `
    <input type="text" class="input-area" placeholder="Type a task.." />
    <div class="btns">
      <button id="edit-button" class="remove-btn edit" onclick="editTask(event)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
      </button>
      <button id="remove-button" onclick="removeTask('${task.id}')" class="remove-btn remove">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
      </button>
    </div>
  `;

  const taskInput = task.querySelector(".input-area");

  taskInput.addEventListener("input", () => {
    updateInput(task.id, taskInput.value, task.parentElement.id);
  });

  task.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  });
  dragAndDrop();
  return task;
}

function createDropArea(taskId) {
  const dropArea = document.createElement("div");
  dropArea.classList.add("dropzone");
  dropArea.id = `dropzone-${taskId}`;
  return dropArea;
}

function dragAndDrop() {
  const dropAreas = document.querySelectorAll(".dropzone");
  dropAreas.forEach((dropArea) => {
    dropArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropArea.classList.add("active");
    });

    dropAreas.forEach((dropArea) => {
      dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("active");
      });
    });

    dropArea.addEventListener("drop", (e) => {
      e.preventDefault();
      dropArea.classList.remove("active");

      const dragTask = e.dataTransfer.getData("text/plain");

      const draggedTask = document.getElementById(dragTask);

      dropArea.after(draggedTask, draggedTask.nextElementSibling);

      const taskInput = draggedTask.querySelector(".input-area");

      const dropzoneArr = [...dropAreas];
      const dropzoneIndex = dropzoneArr.indexOf(dropArea);

      const taskObj = {
        id: dragTask,
        content: taskInput.value,
        status: draggedTask.parentElement.id,
        dropArea: dropArea.id,
      };

      listOne = listOne.filter((task) => task.id !== dragTask);
      listTwo = listTwo.filter((task) => task.id !== dragTask);
      listThree = listThree.filter((task) => task.id !== dragTask);

      if (taskObj.status === "not-started") {
        listOne.splice(dropzoneIndex, 0, taskObj);
      }

      if (taskObj.status === "in-progress") {
        listTwo.splice(dropzoneIndex, 0, taskObj);
      }

      if (taskObj.status === "completed") {
        listThree.splice(dropzoneIndex, 0, taskObj);
      }

      storeData("listOne", listOne);
      storeData("listTwo", listTwo);
      storeData("listThree", listThree);
    });
  });
}

function addTaskDOM(parentId) {
  const parentList = document.getElementById(parentId);
  const task = addTask();
  const taskId = task.id;
  const dropArea = createDropArea(taskId);
  parentList.lastElementChild.before(task);
  task.after(dropArea);

  const taskObj = {
    id: taskId,
    content: "",
    status: parentId,
    dropArea: dropArea.id,
  };

  if (taskObj.status === "not-started") {
    listOne.push(taskObj);
    storeData("listOne", listOne);
  }

  if (taskObj.status === "in-progress") {
    listTwo.push(taskObj);
    storeData("listTwo", listTwo);
  }

  if (taskObj.status === "completed") {
    listThree.push(taskObj);
    storeData("listThree", listThree);
  }
}

function generateId() {
  return Date.now().toLocaleString();
}

function editTask(e) {
  const taskInput = e.target.closest(".task").querySelector(".input-area");
  taskInput.select();
}

function removeTask(id) {
  const task = document.getElementById(id);
  const dropArea = document.getElementById(`dropzone-${id}`);
  task.remove();
  dropArea.remove();

  listOne = listOne.filter((task) => task.id !== id);
  listTwo = listTwo.filter((task) => task.id !== id);
  listThree = listThree.filter((task) => task.id !== id);

  storeData("listOne", listOne);
  storeData("listTwo", listTwo);
  storeData("listThree", listThree);
}

function updateInput(id, content, parentId) {
  const task_NotStarted = listOne.find((task) => task.id === id);
  const task_InProgress = listTwo.find((task) => task.id === id);
  const task_Completed = listThree.find((task) => task.id === id);

  if (parentId === "not-started") {
    task_NotStarted.content = content;
    storeData("listOne", listOne);
  }

  if (parentId === "in-progress") {
    task_InProgress.content = content;
    storeData("listTwo", listTwo);
  }

  if (parentId === "completed") {
    task_Completed.content = content;
    storeData("listThree", listThree);
  }
}

function storeData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
