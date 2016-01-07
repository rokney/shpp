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
    createNewListElement(listItem, text);
    todoList.appendChild(listItem);
    tasksLeft.innerText = totalTasks + ' tasks left';
}

function createNewListElement(listItem, text){
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
    btnRemove.addEventListener("click", removeTask);
}

function changeItem() {
    var currList = this.parentNode;
    var input = document.createElement("input");
    input.type = "text";

    input.value = this.innerHTML;

    input.onkeyup = function (event) {
        if (event.which == 13) {
            var textValue = input.value;
            parentNode = currList.parentNode;
            currList.innerHTML = "";
            createNewListElement(currList, textValue);
            parentNode.appendChild(currList);
        }
    }
    currList.replaceChild(input, currList.firstChild);
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

    listToDoElements.splice(listToDoElements.indexOf(currentTask), 1);
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
    changeButtonStyle(1);
    for (i = 0; i < listToDoElements.length; i++) {
        listToDoElements[i].style.display = 'block';
    }
}
function displayActive() {
    changeButtonStyle(2);
    for (i = 0; i < listToDoElements.length; i++) {
        var currItem = listToDoElements[i].firstChild;
        if (!currItem.checked) {
            currItem.parentNode.style.display = "block";
        } else {
            currItem.parentNode.style.display = "none";
        }
    }
}

function displayCompleted() {
    changeButtonStyle(3);
    for (i = 0; i < listToDoElements.length; i++) {
        var currItem = listToDoElements[i].firstChild;
        if (currItem.checked) {
            currItem.parentNode.style.display = "block";
        } else {
            currItem.parentNode.style.display = "none";
        }
    }
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
    checked = 0;
    document.getElementById("clear").style.display = "none";
}

function changeButtonStyle(id) {
    if (id == 1) {
        document.getElementById("all").style.color = "red";
        document.getElementById("active").style.color = "black";
        document.getElementById("completed").style.color = "black";
    }
    if (id == 2) {
        document.getElementById("all").style.color = "black";
        document.getElementById("active").style.color = "red";
        document.getElementById("completed").style.color = "black";
    }
    if (id == 3) {
        document.getElementById("all").style.color = "black";
        document.getElementById("active").style.color = "black";
        document.getElementById("completed").style.color = "red";
    }
}

function selectAll() {
    var chB = document.getElementById("selAll")
    totalTasks = 0;
    if (chB.checked) {
        for (i = 0; i < listToDoElements.length; i++) {
            var currItem = listToDoElements[i].firstChild;
            currItem.checked = true;
        }
        checked = listToDoElements.length;
        tasksLeft.innerText = totalTasks + ' tasks left';
        document.getElementById("clear").style.display = "block";
    } else {
        for (i = 0; i < listToDoElements.length; i++) {
            var currItem = listToDoElements[i].firstChild;
            currItem.checked = false;
        }
        checked = 0;
        totalTasks = listToDoElements.length;
        tasksLeft.innerText = totalTasks + ' tasks left';
        document.getElementById("clear").style.display = "none";
    }
}