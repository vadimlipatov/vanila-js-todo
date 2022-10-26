(function () {
  // Globals
  const todoList = document.querySelector("#todo-list");
  const select = document.querySelector("#user-todo");
  const form = document.querySelector("form");

  let todos = [];
  let users = [];

  //Attach events
  document.addEventListener("DOMContentLoaded", initApp);
  form.addEventListener("submit", handleSubmit);

  //Basic logic
  function getUserName(id) {
    return users.find((user) => user.id == id).name;
  }

  function printTodo({ id, userId, title, completed }) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b></span>`;

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.checked = completed;
    checkbox.addEventListener("change", handleTodoChange);
    li.prepend(checkbox);

    let close = document.createElement("span");
    close.innerHTML = "&times;";
    close.className = "close";
    close.addEventListener("click", handleClose);
    li.append(close);

    todoList.prepend(li);
  }

  function createUserOption(user) {
    const option = document.createElement("option");
    option.value = user.id;
    option.className = "";
    option.innerText = user.name;
    select.append(option);
  }

  function removeTodo(todoId) {
    //   console.log(todoId);
    todos = todos.filter((todo) => {
      todo.id !== todoId;
    });

    const todo = todoList.querySelector(`[data-id="${todoId}"]`);
    todo.querySelector("input").removeEventListener("change", handleTodoChange);
    todo.querySelector("span.close").removeEventListener("click", handleClose);
    todo.remove();
  }

  function alertError(error) {
    alert(error.message);
  }

  //Event Logic
  function initApp() {
    Promise.all([getAllUsers(), getAllTodos()]).then((data) => {
      [users, todos] = data;

      //отправить в разметку
      todos.forEach((todo) => printTodo(todo));

      //Заполнить select
      users.forEach((user) => {
        createUserOption(user);
      });

      //
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    let todo = {
      userId: +form.user.value,
      title: form.todo.value,
      completed: false,
    };
    createTodo(todo);
    form.reset();
  }

  function handleTodoChange(e) {
    let todoId = +e.target.parentElement.dataset.id;
    let completed = e.target.checked;
    toggleTodoComplete(todoId, completed);
  }

  function handleClose(e) {
    let todoId = +e.target.parentElement.dataset.id;
    deleteTodo(todoId);
    removeTodo(todoId);
  }

  //Async logic
  async function getAllUsers() {
    try {
      let response = await fetch("https://jsonplaceholder.typicode.com/users");
      let data = await response.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function getAllTodos() {
    try {
      let request = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      let data = await request.json();

      return data;
    } catch (error) {
      alertError(error);
    }
  }

  async function createTodo(todo) {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos/",
        {
          method: "POST",
          body: JSON.stringify(todo),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newTodo = await response.json();
      printTodo(newTodo);
    } catch (error) {
      alertError(error);
    }
  }

  async function toggleTodoComplete(todoId, completed) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            completed,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Fetch patch error");
      }
    } catch (error) {
      alertError(error);
    }
  }

  async function deleteTodo(todoId) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Fetch delete Error");
      }
    } catch (error) {
      alertError(error);
    }
  }
})();
