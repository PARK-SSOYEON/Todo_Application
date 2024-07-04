document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const doneList = document.getElementById("doneList");

    loadFromLocalStorage();

    //task 추가
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            const taskId="task-"+Date.now();
            const li= CreateTaskElement(taskText, taskId);

            taskList.appendChild(li);
            taskInput.value = "";

            saveToLocalStorage();
        }
    }

    //task 생성 및 변화 처리
    function CreateTaskElement(taskText, taskId) {
        const li=document.createElement("li");

        li.textContent = taskText;
        li.className = "task-item";
        li.id=taskId;

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttons"

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "삭제";
        deleteButton.onclick = function () {
            const parentList = li.parentNode;
            parentList.removeChild(li);
            saveToLocalStorage();
        };

        const completeButton = document.createElement("button");
        completeButton.textContent = isTaskCompleted(taskId) ? "미완료" : "완료";
        completeButton.onclick = function () {
            li.classList.toggle("done-item");
            if (li.classList.contains("done-item")) {
                taskList.removeChild(li);
                doneList.appendChild(li);
                completeButton.textContent = "미완료";
            } else {
                doneList.removeChild(li);
                taskList.appendChild(li);
                completeButton.textContent = "완료";
            }
            saveToLocalStorage();
        };

        buttonsDiv.appendChild(completeButton);
        buttonsDiv.appendChild(deleteButton);

        li.appendChild(buttonsDiv);

        return li;
    }

    function isTaskCompleted(taskId) {
        const doneTasks = JSON.parse(localStorage.getItem("doneTasks")) || [];
        return doneTasks.some(task => task.id === taskId);
    }

    //로컬 스토리지에 저장
    function saveToLocalStorage() {
        const tasks=[];
        const doneTasks = [];

        taskList.childNodes.forEach(function (item) {
            const textNodes = Array.from(item.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join("");

            tasks.push({
                id: item.id,
                text: textNodes
            });
        });

        doneList.childNodes.forEach(function (item) {
            const textNodes = Array.from(item.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join("");

            doneTasks.push({
                id: item.id,
                text: textNodes
            });
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
    }

    //로컬 스토리지 불러오기
    function loadFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const doneTasks = JSON.parse(localStorage.getItem("doneTasks")) || [];

        tasks.forEach(function (task) {
            const li = CreateTaskElement(task.text, task.id);
            taskList.appendChild(li);
        });

        doneTasks.forEach(function (task) {
            const li = CreateTaskElement(task.text, task.id);
            li.classList.add("done-item"); // 완료 표시
            doneList.appendChild(li);
        });
    }

    //버튼 클릭 시 task 추가
    document.querySelector("button").addEventListener("click", addTask);

    //Enter 클릭 시 task 추가
    taskInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    })
})
