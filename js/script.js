document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todoForm");
  const todoInput = document.getElementById("todoInput");
  const dateInput = document.getElementById("dateInput");
  const todoBody = document.getElementById("todoBody");
  const statusFilter = document.getElementById("statusFilter");
  const deleteAll = document.getElementById("deleteAll");

  const totalCount = document.getElementById("totalCount");
  const doneCount = document.getElementById("doneCount");
  const pendingCount = document.getElementById("pendingCount");
  const progressBar = document.getElementById("progressBar");
  const progressPercent = document.getElementById("progressPercent");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  // Tambah Task
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const task = todoInput.value.trim();
    const date = dateInput.value;

    if (task === "" || date === "") {
      alert("Please fill in both task and date!");
      return;
    }

    const todo = {
      id: Date.now(),
      task,
      date,
      completed: false
    };

    todos.push(todo);
    saveData();
    renderTodos();
    todoForm.reset();
  });

  // Render Tabel
  function renderTodos() {
    todoBody.innerHTML = "";

    let filtered = todos;
    const filterValue = statusFilter.value;

    if (filterValue === "done") {
      filtered = todos.filter(t => t.completed);
    } else if (filterValue === "pending") {
      filtered = todos.filter(t => !t.completed);
    }

    if (filtered.length === 0) {
      todoBody.innerHTML = `
        <tr><td colspan="5" style="text-align:center; color:#777;">No tasks found.</td></tr>
      `;
      updateStats();
      return;
    }

    filtered.forEach((todo, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${todo.task}</td>
        <td>${todo.date}</td>
        <td>${todo.completed ? "✅ Completed" : "🕒 Pending"}</td>
        <td>
          <button class="complete">${todo.completed ? "Undo" : "Done"}</button>
          <button class="delete">Del</button>
        </td>
      `;

      tr.querySelector(".complete").addEventListener("click", () => toggleComplete(todo.id));
      tr.querySelector(".delete").addEventListener("click", () => deleteTodo(todo.id));

      todoBody.appendChild(tr);
    });

    updateStats();
  }

  // Tandai selesai / belum
  function toggleComplete(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveData();
    renderTodos();
  }

  // Hapus task
  function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveData();
    renderTodos();
  }

  // Hapus semua data
  deleteAll.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      todos = [];
      saveData();
      renderTodos();
    }
  });

  // Update Statistik
  function updateStats() {
    const total = todos.length;
    const done = todos.filter(t => t.completed).length;
    const pending = total - done;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    totalCount.textContent = total;
    doneCount.textContent = done;
    pendingCount.textContent = pending;
    progressPercent.textContent = `${progress}%`;
    progressBar.style.width = `${progress}%`;
  }

  // Simpan ke local storage
  function saveData() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  // Filter
  statusFilter.addEventListener("change", renderTodos);

  // Load awal
  renderTodos();
});
