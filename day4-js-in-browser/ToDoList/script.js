var listTasks = [];
var listChecks = [];
var checked = 0;
window.onload = function () {
    if (localStorage["tasks"] && localStorage["checks"]) {
        listTasks = JSON.parse(localStorage["tasks"]);
        listChecks = JSON.parse(localStorage["checks"]);
        if (localStorage["selall"] == true) {
            document.getElementById("selAll").checked = localStorage["selall"];
            selectAll();
        }
        if (localStorage["btnSelect"] == 1) {
            displayActive();
        } else if (localStorage["btnSelect"] == 2) {
            displayCompleted();
        } else {
            displayAll();
        }

    }
}

var tasksLeft = document.getElementById("totalTasks");
var inputText = document.getElementById("text");
inputText.onkeyup = function (e) {
    if (e.which == 13) {
        var textValue = inputText.value;
        if (textValue == "" || textValue == " ") {
            return false;
        }
        listTasks.push(textValue);
        listChecks.push(false);
        updateTasks();
        this.value = "";
    }
}

var list = document.getElementById("todolist");
function updateTasks() {
    list.innerHTML = "";
    for (i = 0; i < listTasks.length; i++) {
        var listItem = document.createElement("li");
        addNewTask(listItem, i);
        list.appendChild(listItem);
    }
    var diff = listTasks.length - checked;
    tasksLeft.innerText = diff + ' tasks left';
    localStorage["tasks"] = JSON.stringify(listTasks);
    localStorage["checks"] = JSON.stringify(listChecks);
}

function addNewTask(listItem, index) {
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.id = index;
    if (listChecks[index]) {
        checkBox.checked = true;
    }
    checkBox.onclick = function () {
        updateStatus(index);
    }
    var span = document.createElement("span");
    span.innerText = listTasks[index];
    span.ondblclick = function () {
        changeTask(span, index);
    }
    var btnRemove = document.createElement("div");
    btnRemove.setAttribute("class", "remove");
    btnRemove.innerHTML = "<img src='img/icon-delete.png'>";
    btnRemove.onclick = function () {
        removeTask(index);
    }
    listItem.appendChild(checkBox);
    listItem.appendChild(span);
    listItem.appendChild(btnRemove);
}


function updateStatus(index) {
    if (listChecks[index]) {
        listChecks[index] = false;
        checked--;
        if (checked == 0) {
            document.getElementById("clear").style.display = "none";
        }
    } else {
        listChecks[index] = true;
        checked++;
        document.getElementById("clear").style.display = "block";
    }
    updateTasks();
}

function removeTask(index) {
    if (listChecks[index]) {
        checked--;
    }
    if (checked == 0) {
        document.getElementById("clear").style.display = "none";
    }
    listTasks.splice(index, 1);
    listChecks.splice(index, 1);
    updateTasks();
}

function changeTask(span, index) {
    var list = document.getElementById(index);
    var input = document.createElement('input');
    input.type = 'text';
    input.setAttribute("class", "changetext");
    input.value = listTasks[index];
    input.onkeyup = function (e) {
        if (e.which == 27) {
            updateTasks();
        }
        if (e.which == 13) {
            listTasks[index] = input.value;
            if (input.value == "" || input.value == " ") {
                removeTask(index);
            }
            updateTasks();
        }
    }
    input.onblur = function () {
        updateTasks();
    }
    list.parentNode.replaceChild(input, span);
    input.focus();
    input.select();
}

function deleteCompleted() {
    for (i = 0; i < listChecks.length; i++) {
        if (listChecks[i]) {
            listChecks.splice(i, 1);
            listTasks.splice(i, 1);
            i--;
        }
    }
    checked = 0;
    document.getElementById("clear").style.display = "none";
    document.getElementById("selAll").checked = false;
    updateTasks();
}

function displayAll() {
    changeButtonStyle(0);
    updateTasks();
}

function displayActive() {
    changeButtonStyle(1);
    list.innerHTML = "";
    for (i = 0; i < listChecks.length; i++) {
        if (!listChecks[i]) {

            var listItem = document.createElement("li");
            addNewTask(listItem, i);
            list.appendChild(listItem);
        }
    }
    var diff = listTasks.length - checked;
    tasksLeft.innerText = diff + ' tasks left';
}

function displayCompleted() {
    changeButtonStyle(2);
    list.innerHTML = "";
    for (i = 0; i < listChecks.length; i++) {
        if (listChecks[i]) {

            var listItem = document.createElement("li");
            addNewTask(listItem, i);
            list.appendChild(listItem);
        }
    }
    var diff = listTasks.length - checked;
    tasksLeft.innerText = diff + ' tasks left';
}

function selectAll() {
    var select = document.getElementById("selAll");
    if (select.checked) {
        localStorage["selall"] = true;
        for (i = 0; i < listChecks.length; i++) {
            listChecks[i] = true;
            checked = listChecks.length;
        }
        document.getElementById("clear").style.display = "block";
    } else {
        localStorage["selall"] = false;
        for (i = 0; i < listChecks.length; i++) {
            listChecks[i] = false;
            checked = 0;
        }
        document.getElementById("clear").style.display = "none";
    }
    updateTasks()
}

function changeButtonStyle(id) {
    if (id == 0) {
        localStorage["btnSelect"] = 0;
        document.getElementById("all").style.color = "red";
        document.getElementById("active").style.color = "black";
        document.getElementById("completed").style.color = "black";
    }
    if (id == 1) {
        localStorage["btnSelect"] = 1;
        document.getElementById("all").style.color = "black";
        document.getElementById("active").style.color = "red";
        document.getElementById("completed").style.color = "black";
    }
    if (id == 2) {
        localStorage["btnSelect"] = 2;
        document.getElementById("all").style.color = "black";
        document.getElementById("active").style.color = "black";
        document.getElementById("completed").style.color = "red";
    }
}