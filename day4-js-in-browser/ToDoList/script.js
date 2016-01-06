/**
 * Created by rokne on 06.01.2016.
 */

listToDoElements = [];

var totalTasks = 0;
var checked = 0;
var tasksLeft = document.getElementById("totalTasks");
var inputText = document.getElementById("text");
inputText.focus();
inputText.onkeyup = function (event) {
    if (event.which == 13) {
        var textValue = inputText.value;
        if (textValue == "" || textValue == " ") {
            return false;
        }

        addNewTask(document.getElementById("todolist"), textValue);
        inputText.focus();
        inputText.value = "";

    }
}
function addNewTask(todoList, text) {
    totalTasks++;
    var listItem = document.createElement("li");
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.addEventListener("click", updateStatus);
    var span = document.createElement("span");
    span.innerText = text;
    var btnRemove = document.createElement("div")
    btnRemove.setAttribute("class", "remove");
    btnRemove.innerHTML = "<img src='img/delete.png'>";
    listItem.appendChild(checkBox);
    listItem.appendChild(span);
    listItem.appendChild(btnRemove);
    span.addEventListener("dblclick", changeItem);
    listToDoElements.push(listItem);
    localStorage["todolist"] = JSON.stringify(listToDoElements);
    btnRemove.addEventListener("click", removeTask);
    todoList.appendChild(listItem);
    tasksLeft.innerText = totalTasks + ' tasks left';
}

function changeItem() {
   
}

function removeTask() {
    var currentTask = this.parentNode;
    var currentCheckBox = currentTask.firstChild;
    if (currentCheckBox.checked) {
        currentTask.style.display = "none";
        currentTask.setAttribute("class", "");
    } else {
        totalTasks = (totalTasks >= 0) ? totalTasks - 1 : totalTasks;
        currentTask.style.display = "none";
        currentTask.setAttribute("class", "");
    }
    tasksLeft.innerText = totalTasks + ' tasks left';
}

function updateStatus() {
    if (this.checked) {
        this.setAttribute("class", "checked");
        checked++;
        document.getElementById("clear").style.display = "block";
        totalTasks--;
    } else {
        checked--;
        if (checked == 0) {
            document.getElementById("clear").style.display = "none";
        }
        this.setAttribute("class", "unchecked");
        totalTasks++;
    }
    tasksLeft.innerText = totalTasks + ' tasks left';
}

function displayAll() {
    for (i = 0; i < listToDoElements.length; i++) {
        listToDoElements[i].style.display = 'block';
    }
    localStorage["todolist"] = JSON.stringify(listToDoElements);
}
function displayActive() {
    for (i = 0; i < listToDoElements.length; i++) {
        var currItem = listToDoElements[i].firstChild;
        if (!currItem.checked) {
            currItem.parentNode.style.display = "block";
        } else {
            currItem.parentNode.style.display = "none";
        }
    }
    localStorage["todolist"] = JSON.stringify(listToDoElements);
}

function displayCompleted() {
    for (i = 0; i < listToDoElements.length; i++) {
        var currItem = listToDoElements[i].firstChild;
        if (currItem.checked) {
            currItem.parentNode.style.display = "block";
        } else {
            currItem.parentNode.style.display = "none";
        }
    }
    localStorage["todolist"] = JSON.stringify(listToDoElements);
}

function deleteCompleted() {
    for (i = 0; i < listToDoElements.length; i++) {
        var currItem = listToDoElements[i].firstChild;
        if (currItem.checked) {
            currItem.parentNode.style.display = "none";
            listToDoElements.splice(i, 1);
            i--;
        }
    }
    localStorage["todolist"] = JSON.stringify(listToDoElements);
    checked = 0;
    document.getElementById("clear").style.display = "none";
}