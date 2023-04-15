const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;

// getting the items from the localstorage
todos = JSON.parse(localStorage.getItem("todo-list"));

// getting over all the filters- All, Pending and Completed and activating the current selected one
filters.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodos(btn.id); // we put the selected section here 
    });
});

// This fucntion put all the current filtered task to the window
function showTodos(filter){
    let li = "";
    if(todos){
        todos.forEach((todo, id) => {
            // if the todo is already marked completed, 
            // then update this todo, and even if the user refreshes the data it will still be marked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all"){
                li += `
                <li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                        <p class="${isCompleted}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                        <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-regular fa-pen-to-square"></i>Edit</li>
                        <li onclick="deleteTask(${id})"><i class="fa-solid fa-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>You dont have any of tasks here <i class="em em-mailbox" aria-role="presentation" aria-label="CLOSED MAILBOX WITH RAISED FLAG"></i></span>`;

    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodos("all");

function showMenu(selectedTask){
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e=>{
        if(e.target.tagName != "I" || e.target != selectedTask){
            taskMenu.classList.remove("show");
        }
    });
};

function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    }else{
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    // this will keep the track of completed task even afetr the browser is reloaded 
    localStorage.setItem("todo-list", JSON.stringify(todos));
};

function editTask(taskId, taskName){
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName
}

function deleteTask(deleteId){
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodos("all");
}
clearAll.addEventListener("click", () => {
    isEditedTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodos("all")
});

// This function program is responsible for adding the new task user entered in the input box
// to the local storage and using showTodos() function the same are updated in real time

taskInput.addEventListener("keyup", e=>{
    let userTask = taskInput.value.trim(); // Trim will check for empty inputs
    if(e.key == "Enter" && userTask){
        if(!isEditedTask){
            if(!todos){
                todos = []; // initilizing the localstorage with empty array
            }
            let taskInfo = {name: userTask, status: "pending"}; // as the task is new, it stated with pending tag
            todos.push(taskInfo); // pushed the task into the array - localstorage
        }else{
            isEditedTask = false;
            todos[editId].name = userTask;
        }

        taskInput.value = ""; // null value for new task entries
       
        localStorage.setItem("todo-list", JSON.stringify(todos)); // the localStorage set item works as keyName, and keyValue
        showTodos("all");
    }
});