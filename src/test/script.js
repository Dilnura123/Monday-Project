let currentTab = 'tasks';
    let currentFilter = 'all';

    let tasks = JSON.parse(localStorage.getItem('finch_exact_tasks')) || [];
    let habits = JSON.parse(localStorage.getItem('finch_exact_habits')) || [];

    function getActiveList() {
        return currentTab === 'tasks' ? tasks : habits;
    }

    function render() {
        const listEl = document.getElementById('taskList');
        listEl.innerHTML = '';

        let list = getActiveList();

        let filtered = list.filter(item => {
            if (currentFilter === 'active') return !item.done;
            if (currentFilter === 'completed') return item.done;
            return true;
        });

        let allItems = [...tasks, ...habits];
        let total = allItems.length;
        let doneCount = allItems.filter(i => i.done).length;
        let percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

        const energyBar = document.getElementById('energyBar');
        const petAvatar = document.getElementById('petAvatar');
        const petStatus = document.getElementById('petStatus');

        energyBar.style.width = percent + '%';

        if (total === 0) {
            petAvatar.innerText = '🥚';
            petStatus.innerText = 'Птичка ждет первое дело, чтобы вылупиться!';
        } else if (percent === 100) {
            petAvatar.innerText = '🥳';
            petStatus.innerText = 'Ура! Киви нашел все сокровища в путешествии!';
        } else if (percent >= 50) {
            petAvatar.innerText = '🪂';
            petStatus.innerText = 'Киви летит к новой цели! Выполнено ${percent}%.';
        } else {
            petAvatar.innerText = '🦜';
            petStatus.innerText = 'Киви гуляет по парку. Сделай шажок к цели! (${percent}%)';
        }

        filtered.forEach((item) => {
            let index = list.indexOf(item);
            let li = document.createElement('li');
            if (item.done) li.classList.add('done');

            li.innerHTML = `
                <div class="task-info" onclick="toggleItem(${index})">
                    <input type="checkbox" ${item.done ? 'checked' : ''} style="cursor: pointer;">
                    <span class="text">${item.text}</span>
                    <span class="time-tag">${item.time}</span>
                </div>
                <button class="delete" onclick="deleteItem(${index})">✕</button>
            ;
            listEl.appendChild(li);`
        });

        localStorage.setItem('finch_exact_tasks', JSON.stringify(tasks));
        localStorage.setItem('finch_exact_habits', JSON.stringify(habits));
    }

    function addTask() {
        let input = document.getElementById('taskInput');
        let text = input.value.trim();
        let time = document.getElementById('timeSelect').value;

        if (text) {
            let newItem = { text, time, done: false };
            if (currentTab === 'tasks') {
                tasks.push(newItem);
            } else {
                habits.push(newItem);
            }
            input.value = '';
            render();
        }
    }

    function toggleItem(index) {
        let list = getActiveList();
        list[index].done = !list[index].done;
        render();
    }

    function deleteItem(index) {
        let list = getActiveList();
        list.splice(index, 1);
        render();
    }

    function switchTab(tab) {
        currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        document.getElementById('taskInput').placeholder = tab === 'tasks' ?'Что нужно сделать для себя?' : 'Новая полезная привычка...';
        render();
    }

    function setFilter(filter) {
        currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        render();
    }

    function clearCompleted() {
        if (currentTab === 'tasks') {
            tasks = tasks.filter(i => !i.done);
        } else {
            habits = habits.filter(i => !i.done);
        }
        render();
    }

    render();

    document.getElementById('startBtn').addEventListener('click', () => {
  const intro = document.getElementById('intro');
  intro.classList.add('open');
  setTimeout(() => intro.classList.add('hidden'), 1000);
});





const emojis = [
    "🌻", "🪥", "🧼", "🥤",
    "🦒", "😊", "🍃", "🌸"
];


// OPEN APP

function openApp() {

    document.getElementById("startScreen").style.display = "none";

    document.getElementById("mainApp").style.display = "block";

    render();

}


// ADD TASK

function addTask() {

    const input = document.getElementById("taskInput");

    const text = input.value.trim();

    if (text === "") {
        alert("Сначала напиши своё задание 🌸");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    input.value = "";

    render();

}


// FILTER TASKS

function setFilter(filter, button) {

    currentFilter = filter;

    document.querySelectorAll(".filters button")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    render();

}


// COMPLETE TASK

function toggleTask(id) {

    const task = tasks.find(t => t.id === id);

    if (task) {
        task.done = !task.done;
    }

    render();

}


// DELETE TASK

function deleteTask(id) {

    tasks = tasks.filter(t => t.id !== id);

    render();

}


// RENDER NOTEBOOK

function renderNotebook() {

    const area = document.getElementById("notebookArea");

    const container = document.getElementById("notebookGoals");

    // Тетрадка открывается только при выборе «Все»

    area.style.display =
        currentFilter === "all" ? "block" : "none";

    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = ` 
            <div class="empty-notebook">
                🌸 Пока нет заданий!<br>
                Напиши своё первое задание слева.
            </div>
        `;
        return;
    }

    tasks.forEach((task, index) => {

        const item = document.createElement("div");

        item.className = "notebook-goal" +
            (task.done ? " completed" : "");

        const emoji = document.createElement("span");

        emoji.className = "emoji";

        emoji.textContent = emojis[index % emojis.length];

        const name = document.createElement("span");

        name.className = "goal-name";

        name.textContent = task.text;

        item.appendChild(emoji);
        item.appendChild(name);

        container.appendChild(item);

    });

}


// RENDER TASK LIST

function renderTaskList() {

    const list = document.getElementById("taskList");

    list.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.done;
        }

        if (currentFilter === "done") {
            return task.done;
        }

        return true;

    });

    filteredTasks.forEach(task => {

        const item = document.createElement("div");

        item.className = "task-item" +
            (task.done ? " done" : "");

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.done;

        checkbox.onchange = () => toggleTask(task.id);

        const name = document.createElement("span");

        name.textContent = task.text;

        const del = document.createElement("button");

        del.className = "delete-btn";
        del.textContent = "✕";

        del.onclick = () => deleteTask(task.id);

        item.appendChild(checkbox);
        item.appendChild(name);
        item.appendChild(del);

        list.appendChild(item);

    });

}


