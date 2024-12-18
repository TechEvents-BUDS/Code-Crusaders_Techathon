// ###### Event Listeners #####
$(document).ready(() => {
    $("#button-add").on("click", () => {
        enableFormCreateMode();
        clearForm();
        displayAddEditSection();
    });

    $("#arrow-back").on("click", () => {
        enableFormCreateMode();
        clearForm();
        displayViewSection();
    });

    $("#button-delete").on("click", (event) => {
        event.preventDefault();
        displayConfirmationDelete();
    });

    $("#button-save, #button-create").on("click", (event) => {
        event.preventDefault();
        submitTask();
    });

    $("#button-confirm-yes").on("click", (event) => {
        event.preventDefault();
        hideConfirmationDelete();
        const taskId = parseInt($("#task-id").val());
        if (taskId) {
            deleteTask(taskId);
            updateView();
            displayViewSection();
        }
    });

    $("#button-confirm-no").on("click", (event) => {
        event.preventDefault();
        hideConfirmationDelete();
    });

    $("#task-list").on("click", ".task", function() {
        const taskId = $(this).data("task-id");
        const task = getTaskById(taskId);
        if (task) {
            populateForm(task);
            enableFormEditMode();
            displayAddEditSection();
        }
    });

    $("#task-filter").on("input", filterTasks);
});

// ###### Functions #####
function notify(message) {
    $("#notification").text(message).fadeIn().delay(2500).fadeOut();
}

function enableFormEditMode() {
    $(".form-edit-mode").show();
    $(".form-create-mode").hide();
}

function enableFormCreateMode() {
    $(".form-create-mode").show();
    $(".form-edit-mode").hide();
}

function clearForm() {
    $("#task-id").val("");
    $("#task-name").val("");
    $("#task-description").val("");
    $("#task-priority").val("");
    $(".input-error").hide();
    loadDataSelect();
}

function displayAddEditSection() {
    $("#arrow-back").css("visibility", "visible");
    $(".section-add-edit").show();
    $(".section-view").hide();
}

function displayViewSection() {
    $(".section-view").show();
    $(".section-add-edit").hide();
    $("#arrow-back").css("visibility", "hidden");
}

function displayConfirmationDelete() {
    $(".confirmation-delete").show();
    $("#button-confirm-no").focus();
    $(".crud-buttons").hide();
}

function hideConfirmationDelete() {
    $(".crud-buttons").show();
    $(".confirmation-delete").hide();
}

function updateView() {
    const tasks = getTasks();
    $("#task-list").empty();

    tasks.forEach(task => {
        $("#task-list").append(`
            <li class="task-item">
                <div class="task task-priority-${task.priority.toLowerCase()} animation-expand" data-task-id="${task.id}">
                    <div class="task-title"><h3>${task.name}</h3></div>
                    <div class="task-deadline">${formatDate(task.deadline)}</div>
                    <div class="task-priority">${task.priority}</div>
                    <button class="mark-complete" data-task-id="${task.id}">✔️</button>
                </div>
            </li>
        `);
    });

    $(".no-task-message").toggle(!tasks.length);
}

function formatDate(strDate) {
    return new Date(strDate).toLocaleDateString();
}

function submitTask() {
    if (!validateFields()) return;

    const taskId = $("#task-id").val();
    const task = {
        name: $("#task-name").val(),
        deadline: getTaskDate(),
        description: encodeURIComponent($("#task-description").val()),
        priority: $("#task-priority").val()
    };

    if (taskId) {
        task.id = parseInt(taskId);
        updateTask(task);
    } else {
        createTask(task);
    }

    updateView();
    displayViewSection();
}

function validateFields() {
    return validateFieldByName("name") &&
           validateDeadline() &&
           validateFieldByName("description") &&
           validateFieldByName("priority");
}

function validateFieldByName(fieldName) {
    const field = $(`#task-${fieldName}`);
    if (!field.val()) {
        field.focus();
        $(`#input-error-${fieldName}`).show();
        return false;
    }
    $(`#input-error-${fieldName}`).hide();
    return true;
}

function validateDeadline() {
    try {
        getTaskDate();
        $("#input-error-deadline").hide();
        return true;
    } catch {
        $("#task-day").focus();
        $("#input-error-deadline").show();
        return false;
    }
}

function createTask(newTask) {
    newTask.id = getNewTaskId();
    const tasks = getTasks();
    tasks.push(newTask);
    updateTasks(tasks);
    notify("Task created successfully.");
}

function updateTask(taskToUpdate) {
    const tasks = getTasks().map(task => task.id === taskToUpdate.id ? taskToUpdate : task);
    updateTasks(tasks);
    notify("Task updated successfully.");
}

function deleteTask(taskIdToDelete) {
    const tasks = getTasks().filter(task => task.id !== taskIdToDelete);
    updateTasks(tasks);
    notify("Task deleted successfully.");
}

function updateTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTaskById(id) {
    return getTasks().find(task => task.id === id);
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function getNewTaskId() {
    const tasks = getTasks();
    return tasks.length ? Math.max(...tasks.map(task => task.id)) + 1 : 0;
}

function getTaskDate() {
    const day = parseInt($("#task-day").val());
    const month = parseInt($("#task-month").val()) - 1;
    const year = parseInt($("#task-year").val());
    return new Date(year, month, day).toISOString();
}

function loadDataSelect() {
    const today = new Date();
    loadDayOptions(today.getDate());
    $("#task-month").val(today.getMonth() + 1);
    loadYearOptions(today.getFullYear());
}

function loadDayOptions(currentDay) {
    for (let i = 1; i <= 31; i++) {
        $("#task-day").append(`<option value="${i}" ${currentDay === i ? "selected" : ""}>${i}</option>`);
    }
}

function loadYearOptions(currentYear) {
    for (let i = currentYear; i <= currentYear + 10; i++) {
        $("#task-year").append(`<option value="${i}" ${currentYear === i ? "selected" : ""}>${i}</option>`);
    }
}

function populateForm(task) {
    $("#task-id").val(task.id);
    $("#task-name").val(task.name);
    $("#task-description").val(decodeURIComponent(task.description));
    $("#task-priority").val(task.priority);
    const date = new Date(task.deadline);
    $("#task-day").val(date.getDate());
    $("#task-month").val(date.getMonth() + 1);
    $("#task-year").val(date.getFullYear());
}

// Add task completion functionality
$("#task-list").on("click", ".mark-complete", function() {
    const taskId = $(this).data("task-id");
    const task = getTaskById(taskId);
    if (task) {
        task.completed = !task.completed; // Toggle completion status
        updateTask(task);
        updateView();
    }
});

// ###### Main #####
$(document).ready(() => {
    updateView();
    loadDataSelect();
});

$(document).ready(() => {
    updateView();
    loadDataSelect();
});

// Load data for the select inputs
function loadDataSelect() {
    const today = new Date();
    loadDayOptions(today.getDate());
    loadMonthOptions(today.getMonth() + 1);
    loadYearOptions(today.getFullYear());
}

function loadDayOptions(currentDay) {
    for (let i = 1; i <= 31; i++) {
        $("#task-day").append(`<option value="${i}" ${currentDay === i ? "selected" : ""}>${i}</option>`);
    }
}

function loadMonthOptions(currentMonth) {
    for (let i = 1; i <= 12; i++) {
        $("#task-month").append(`<option value="${i}" ${currentMonth === i ? "selected" : ""}>${i}</option>`);
    }
}

function loadYearOptions(currentYear) {
    for (let i = currentYear; i <= currentYear + 10; i++) {
        $("#task-year").append(`<option value="${i}" ${currentYear === i ? "selected" : ""}>${i}</option>`);
    }
}

// Filter tasks based on input
function filterTasks() {
    const input = $("#task-filter").val().toLowerCase();
    $(".task-item").each(function() {
        const taskName = $(this).find(".task-title h3").text().toLowerCase();
        if (taskName.includes(input)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// Attach the filter function to the input event
$("#task-filter").on("input", filterTasks);
// ###### Main #####