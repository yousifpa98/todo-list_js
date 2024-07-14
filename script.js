addEventListener("DOMContentLoaded", (event) => {
    const newTaskInput = document.querySelector(".todo-input");
    const newTaskDescription = document.querySelector("#description-input");
    const todoForm = document.querySelector(".todo-form");
    const noEntriesMessage = document.querySelector("#no-entries");
    let taskList = [];

    // Function to check if localStorage has saved taskList
    function loadTaskList() {
        const storedTasks = localStorage.getItem('taskList');
        if (storedTasks) {
            taskList = JSON.parse(storedTasks);
            renderTaskList();
            isTodoListEmpty();
        }
    }

    // Function to save taskList to localStorage
    function saveTaskList() {
        localStorage.setItem('taskList', JSON.stringify(taskList));
    }

    function isTodoListEmpty() {
        if (taskList.length === 0) {
            noEntriesMessage.style.display = "block";
            return true;
        } else {
            noEntriesMessage.style.display = "none";
            return false;
        }
    }

    function addToTaskList(task, description) {
        taskList.push({
            number: taskList.length + 1,
            task: task,
            description: description,
            completed: false
        });
        saveTaskList();
        renderTaskList();
        isTodoListEmpty();
    }

    function deleteTask(taskIndex) {
        taskList.splice(taskIndex, 1);
        saveTaskList();
        renderTaskList();
        isTodoListEmpty();
    }

    function renderTaskList() {
        const taskListContainer = document.querySelector(".todo-list");
        taskListContainer.innerHTML = "";
        taskList.forEach((task, index) => {
            const completeButtonClass = task.completed ? 'uncomplete-button' : 'complete-button';
            const completeButtonIcon = task.completed ? '<i class="fas fa-times"></i>' : '<i class="fas fa-check"></i>';
            const taskItem = document.createElement('div');
            taskItem.classList.add('todo-item');
            taskItem.setAttribute('data-index', index);
            taskItem.innerHTML = `
                <details class="todo-task" id="task-${index}">
                    <summary>${task.task}</summary>
                    <p>${task.description}</p>
                </details>
                <div class="todo-item-controls">
                    <button class="${completeButtonClass}">
                        ${completeButtonIcon}
                    </button>
                    <button class="delete-button">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            if (task.completed) {
                taskItem.classList.add('completed-task');
            }
            taskListContainer.appendChild(taskItem);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll(".delete-button").forEach((button) => {
            button.addEventListener("click", function () {
                const index = this.closest(".todo-item").getAttribute("data-index");
                deleteTask(index);
            });
        });

        // Attach event listeners to complete/uncomplete buttons
        document.querySelectorAll(".complete-button, .uncomplete-button").forEach((button) => {
            button.addEventListener("click", function () {
                const index = this.closest(".todo-item").getAttribute("data-index");
                toggleCompletion(index);
            });
        });
    }

    function toggleCompletion(index) {
        taskList[index].completed = !taskList[index].completed;
        saveTaskList();
        renderTaskList();
    }

    todoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        addToTaskList(newTaskInput.value, newTaskDescription.value);
        newTaskInput.value = ""; // Clear input field
        newTaskDescription.value = ""; // Clear description field
    });

    // Load saved task list from localStorage on page load
    loadTaskList();

    // Initial render to check if the task list is empty
    isTodoListEmpty();
});
