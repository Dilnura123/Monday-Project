
import { useState, useEffect } from 'react';
import './App.css';

const emojis = [
  '🌻', '🪥', '🧼', '🥤',
  '🦒', '😊', '🍃', '🌸'
];

function App() {

  // Получаем сохраненные задачи
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem('finch_exact_tasks')) || [];
  });

  // Получаем сохраненные привычки
  const [habits, setHabits] = useState(() => {
    return JSON.parse(localStorage.getItem('finch_exact_habits')) || [];
  });

  // Состояние вкладок и фильтров
  const [currentTab, setCurrentTab] = useState('tasks');
  const [currentFilter, setCurrentFilter] = useState('all');

  // Поля ввода
  const [taskInput, setTaskInput] = useState('');
  const [selectedTime, setSelectedTime] = useState('🌅 Утро');

  // Экран приветствия
  const [introOpen, setIntroOpen] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);

  // Сохраняем данные в LocalStorage
  useEffect(() => {
    localStorage.setItem(
      'finch_exact_tasks',
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      'finch_exact_habits',
      JSON.stringify(habits)
    );
  }, [habits]);

  // Получаем текущий список
  const activeList = currentTab === 'tasks' ? tasks : habits;

  const setActiveList = currentTab === 'tasks'
    ? setTasks
    : setHabits;

  // Фильтрация
  const filteredItems = activeList.filter(item => {
    if (currentFilter === 'active') return !item.done;
    if (currentFilter === 'completed') return item.done;

    return true;
  });

  // Статистика для птички
  const allItems = [...tasks, ...habits];

  const total = allItems.length;

  const doneCount = allItems.filter(
    item => item.done
  ).length;

  const percent = total === 0
    ? 0
    : Math.round((doneCount / total) * 100);

  // Состояние птички
  let petAvatar = '🦜';
  let petStatus = `Киви гуляет по парку. Сделай шажок к цели! (${percent}%)`;

  if (total === 0) {
    petAvatar = '🥚';
    petStatus = 'Птичка ждет первое дело, чтобы вылупиться!';
  } else if (percent === 100) {
    petAvatar = '🥳';
    petStatus = 'Ура! Киви нашел все сокровища в путешествии!';
  } else if (percent >= 50) {
    petAvatar = '🪂';
    petStatus = `Киви летит к новой цели! Выполнено ${percent}%.`;
  }

  // Добавление задачи или привычки
  function addTask() {
    const text = taskInput.trim();

    if (!text) {
      alert('Сначала напиши своё задание 🌸');
      return;
    }

    const newItem = {
      id: Date.now(),
      text: text,
      time: selectedTime,
      done: false
    };

    setActiveList(prev => [...prev, newItem]);

    setTaskInput('');
  }

  // Выполнение задачи
  function toggleItem(id) {
    setActiveList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, done: !item.done }
          : item
      )
    );
  }

  // Удаление задачи
  function deleteItem(id) {
    setActiveList(prev =>
      prev.filter(item => item.id !== id)
    );
  }

  // Удаление выполненных задач
  function clearCompleted() {
    setActiveList(prev =>
      prev.filter(item => !item.done)
    );
  }

  // Переключение вкладок
  function switchTab(tab) {
    setCurrentTab(tab);
    setCurrentFilter('all');

    setTaskInput('');
  }

  // Переключение фильтра
  function setFilter(filter) {
    setCurrentFilter(filter);
  }

  // Запуск приложения
  function openApp() {
    setIntroOpen(true);

    setTimeout(() => {
      setIntroHidden(true);
    }, 1000);
  }

  // Включение разрешения на уведомления
  async function enableNotifications() {
    if (!('Notification' in window)) {
      alert('Ваш браузер не поддерживает уведомления');
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      alert('Уведомления разрешены!');
    } else {
      alert('Разрешение на уведомления не получено');
    }
  }

  return (
    <>

      {/* Главное приложение */}

      <div className="app-container">

        <h2>Мой день и рутина</h2>

        {/* Карточка птички */}

        <div className="pet-card">

          <div className="pet-avatar">
            {petAvatar}
          </div>

          <div className="pet-info">

            <div className="pet-name">
              Птичка Киви в путешествии 🌍
            </div>

            <div className="pet-status">
              {petStatus}
            </div>

            <div className="energy-bar-container">
              <div
                className="energy-bar"
                style={{ width: `${percent}%` }}
              ></div>
            </div>

          </div>

        </div>

        {/* Вкладки */}

        <div className="tabs">

          <button
            className={`tab-btn ${currentTab === 'tasks' ? 'active' : ''}`}
            onClick={() => switchTab('tasks')}
          >
            Задачи
          </button>

          <button
            className={`tab-btn ${currentTab === 'habits' ? 'active' : ''}`}
            onClick={() => switchTab('habits')}
          >
            Привычки
          </button>

        </div>

        {/* Добавление задачи */}

        <div className="row">

          <input
            type="text"
            placeholder={
              currentTab === 'tasks'
                ? 'Что нужно сделать для себя?'
                : 'Новая полезная привычка...'
            }
            value={taskInput}
            onChange={e => setTaskInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') addTask();
            }}
          />

          <button
            className="add-btn"
            onClick={addTask}
          >
            Добавить
          </button>

        </div>

        {/* Выбор времени */}

        <div className="row">

          <select
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
          >
            <option value="🌅 Утро">🌅 Утро</option>
            <option value="☀️ День">☀️ День</option>
            <option value="🌙 Вечер">🌙 Вечер</option>
          </select>

        </div>

        {/* Фильтры */}

        <div className="filters">

          <button
            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>

          <button
            className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Активные
          </button>

          <button
            className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Готово
          </button>

        </div>

        {/* Список задач */}

        <ul id="taskList">

          {filteredItems.map((item, index) => (

            <li
              key={item.id}
              className={item.done ? 'done' : ''}
            >

              <div className="task-info">

                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleItem(item.id)}
                  style={{ cursor: 'pointer' }}
                />

                <span className="text">
                  {item.text}
                </span>

                <span className="time-tag">
                  {item.time}
                </span>

              </div>

              <button
                className="delete"
                onClick={() => deleteItem(item.id)}
              >
                ✕
              </button>

            </li>

          ))}

          {filteredItems.length === 0 && (
            <li className="empty-message">
              Пока здесь ничего нет 🌸
            </li>
          )}

        </ul>

        {/* Дополнительные кнопки */}

        <div className="bottom-actions">

          <button
            className="link-btn"
            onClick={enableNotifications}
          >
            🔔 Включить напоминания
          </button>

          <button
            className="link-btn"
            onClick={clearCompleted}
            style={{ color: '#ef4444' }}
          >
            Удалить выполненные
          </button>

        </div>

        {/* Блокнот с заданиями */}

  
{currentFilter === 'all' && (
  <div id="notebookArea">

    <div className="starter-notebook">

      <div className="notebook-rings">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index}></span>
        ))}
      </div>

      <div className="notebook-heading">
        <h3>🌸 Мой блокнот</h3>
        <p>Мои цели и достижения</p>
      </div>

      <div id="notebookGoals">

        {tasks.length === 0 ? (

          <div className="empty-notebook">
            🌸 Пока нет заданий!
            <br />
            Напиши своё первое задание слева.
          </div>

        ) : (

          tasks.map((task, index) => (

            <div
              key={task.id}
              className={`notebook-goal ${task.done ? 'completed' : ''}`}
            >
              <span className="emoji">
                {emojis[index % emojis.length]}
              </span>

              <span className="goal-name">
                {task.text}
              </span>

            </div>

          ))

        )}

      </div>

    </div>

  </div>
)}


      </div>

      {/* Экран приветствия */}

      {!introHidden && (
        <div
          id="intro"
          className={introOpen ? 'open' : ''}
        >

          <div className="wing left"></div>
          <div className="wing right"></div>

          <div className="intro-center">

            <div className="intro-bird">
              🦜
            </div>

            <h1>Мой день и рутина</h1>

            <button
              id="startBtn"
              onClick={openApp}
            >
              Старт
            </button>

          </div>

        </div>
      )}

    </>
  );
}

export default App;
