document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("task-list");
    const resetButton = document.getElementById("reset-button");
    const fileInput = document.getElementById("file-input");
    const deleteScheduleButton = document.getElementById(
        "delete-schedule-button"
    );
    const addCustomEntryButton = document.getElementById(
        "add-custom-entry-button"
    );
    const customEntryInput = document.getElementById("custom-entry");

    // Function to create a checklist item
    function createTaskItem(task, isChecked, index) {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.checked = isChecked; // Set checkbox state based on local storage
        checkbox.addEventListener("change", toggleCheckbox);

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task;

        const editButton = document.createElement("button");
        editButton.className =
            "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => editEntry(index));

        const deleteButton = document.createElement("button");
        deleteButton.className =
            "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteEntry(index));

        listItem.appendChild(checkbox);
        listItem.appendChild(taskText);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);

        return listItem;
    }

    // Function to toggle the checkbox
    function toggleCheckbox(event) {
        const checkbox = event.target;
        checkbox.parentNode.classList.toggle("checked");

        // Update local storage with checkbox state
        const taskText = checkbox.nextElementSibling.textContent;
        localStorage.setItem(taskText, checkbox.checked);
    }

    // Function to reset the checklist and clear local storage
    function resetChecklist() {
        const checkboxes = document.querySelectorAll(".checkbox");
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
            checkbox.parentNode.classList.remove("checked");
            const taskText = checkbox.nextElementSibling.textContent;
            localStorage.removeItem(taskText);
        });
    }

    // Function to handle file uploads and convert to a task list
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const fileContent = e.target.result;
                tasks = fileContent
                    .split("\n")
                    .map((line) => line.trim())
                    .filter((line) =>
                        line.match(
                            /^\d{1,2}:\d{2} [APap][Mm] - \d{1,2}:\d{2} [APap][Mm]: .+$/
                        )
                    ); // Filter valid lines
                updateTaskList();
                saveTasksToLocalStorage(); // Save the uploaded task list to local storage
            };
            reader.readAsText(file);
        }
    }

    // Function to update the task list based on the tasks array
    function updateTaskList() {
        taskList.innerHTML = ""; // Clear the current task list
        tasks.forEach((task, index) => {
            const isChecked = localStorage.getItem(task) === "true"; // Get checkbox state from local storage
            const taskItem = createTaskItem(task, isChecked, index);
            taskList.appendChild(taskItem);
        });
    }

    // Function to save the tasks to local storage
    function saveTasksToLocalStorage() {
        localStorage.setItem("uploadedTasks", JSON.stringify(tasks));
    }

    // Function to delete an entry
    function deleteEntry(index) {
        if (index >= 0 && index < tasks.length) {
            const deletedTask = tasks.splice(index, 1)[0];
            updateTaskList();
            saveTasksToLocalStorage();
            alert(`Deleted entry: ${deletedTask}`);
        }
    }

    // Function to edit an entry
    function editEntry(index) {
        if (index >= 0 && index < tasks.length) {
            const updatedTask = prompt("Edit the entry:", tasks[index]);
            if (updatedTask !== null) {
                tasks[index] = updatedTask;
                updateTaskList();
                saveTasksToLocalStorage();
            }
        }
    }

    // Add click event listener to the "Add Custom Entry" button
    addCustomEntryButton.addEventListener("click", addCustomEntry);

    // Function to add a custom entry
    function addCustomEntry() {
        const customEntry = customEntryInput.value;
        if (customEntry && customEntry.trim() !== "") {
            tasks.push(customEntry);
            updateTaskList();
            saveTasksToLocalStorage();
            customEntryInput.value = ""; // Clear the input field
        }
    }

    // Add click event listener to the reset button
    resetButton.addEventListener("click", resetChecklist);

    // Add change event listener to the file input
    fileInput.addEventListener("change", handleFileUpload);

    // Populate the task list from local storage on page load
    const savedTasks = localStorage.getItem("uploadedTasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        updateTaskList();
    }

    // Add click event listener to the delete schedule button
    deleteScheduleButton.addEventListener("click", deleteSavedSchedule);

    // Function to delete the saved schedule from local storage
    function deleteSavedSchedule() {
        localStorage.removeItem("uploadedTasks");
        tasks = []; // Clear the current task list
        updateTaskList();
    }
});
