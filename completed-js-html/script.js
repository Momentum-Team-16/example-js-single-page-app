/* Must have -- MVP (minimum viable product) */
// need to show a list of existing todos
const url = 'http://localhost:3000/todos'
const todoList = document.getElementById('todo-list')
const form = document.getElementById('todo-form')

// listen for form submit
form.addEventListener('submit', function (event) {
  event.preventDefault()
  // grab the value from the input
  const todoText = document.querySelector('#todo-text').value
  // send it to the server to create a new todo
  createTodo(todoText)
})

// Listen for different actions on list items
// This is an example of event delegation
todoList.addEventListener('click', function (event) {
  // check to see if what was clicked is the "x" icon
  if (event.target.classList.contains('delete')) {
    // the user intends to delete this todo, so call the function to make that DELETE request
    deleteTodo(event.target)
  }
  if (event.target.classList.contains('edit')) {
    editTodo(event.target)
  }
  if (event.target.classList.contains('update-todo')) {
    updateTodo(event.target)
  }
  if (event.target.classList.contains('cancel')) {
    hideEditControls(event.target.parentElement)
  }
})

/***** CRUD Functions *****/

// GET all the todos
function listTodos() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      // take all the todos
      // loop through and create a new todo item on the page for each one
      for (let todoObj of data) {
        renderTodoItem(todoObj)
      }
    })
}

function deleteTodo(element) {
  // I need to know WHICH todo to delete, so I need the id (matching in db.json)
  const todoId = element.parentElement.id
  fetch(`http://localhost:3000/todos/${todoId}`, {
    method: 'DELETE',
  }).then(function () {
    // this might not be the same DOM structure for you
    element.parentElement.remove()
  })
}

function updateTodo(element) {
  const todoId = element.parentElement.id
  const todoText = document.querySelector('.edit-text')
  fetch(`http://localhost:3000/todos/${todoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: todoText.value,
      updated_at: moment().format(),
    }),
  })
    .then(function (res) {
      return res.json()
    })
    .then(function (data) {
      console.log(data)
      // update the item in the DOM
      renderTodoText(element.parentElement, data)
    })
}

// POST a new todo
function createTodo(todoText) {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // I don't have to include "id" here because json server will add this for me
      item: todoText,
      created_at: moment().format(),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      // what I get back from the server IS the newly created todo object that looks like this:
      /*
      {
        "item": "Another thing!",
        "id": 5
      }
    */
      // So I can take that data and create a new todo item in the DOM
      renderTodoItem(data)
    })
  clearInputs()
}

/***** DOM changing functions *****/

// Add one todo item to the list on the page
function renderTodoItem(todoObj) {
  const itemEl = document.createElement('li')
  // I will need to have the id of the todo in order to edit or delete it later, so make sure it's in the DOM
  itemEl.id = todoObj.id
  // These classes are from the css library I'm using -- you can use your own or leave this out
  itemEl.classList.add(
    'lh-copy',
    'pv3',
    'ba',
    'bl-0',
    'bt-0',
    'br-0',
    'b--dotted',
    'b--black-3'
  )
  renderTodoText(itemEl, todoObj)
  todoList.prepend(itemEl)
}

function renderTodoText(todoListItem, todoObj) {
  todoListItem.innerHTML = `<span class="dib w-60">${todoObj.item}</span><i class="ml2 dark-red fas fa-times delete"></i><i class="ml3 fas fa-edit edit"></i>`
}

function editTodo(element) {
  showEditInput(element.parentElement)
}

function showEditInput(todoItem) {
  todoItem.innerHTML = `
      <input class="edit-text input-reset ba b--black-20 pa2 mb2 w-60" type="text" value="${todoItem.textContent}" autofocus>
      <button class='update-todo bn f6 link br1 ph2 pv1 ml1 dib white bg-green' data-note=${todoItem.id}>save</button>
      <button class='cancel bn f6 link br1 ph2 pv1 ml2 dib black bg-light-gray'>cancel</button>
      `
  todoItem.querySelector('input').select()
}

function hideEditControls(todoItem) {
  fetch(`http://localhost:3000/todos/${todoItem.id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      renderTodoText(todoItem, data)
    })
}

function clearInputs() {
  form.reset()
}

/**** Function that runs as soon as the script file loads *****/
// call this when the script first runs (on page load)
// This runs only on the first load!
listTodos()

/* Nice to haves */
// delete a todo item from the list
// edit an existing todo

// add new todos to the top of the list of existing todos (sort by newest to oldest)
// a way to mark as completed
// indicate whether todo has been completed or not
// filter completed/not completed
