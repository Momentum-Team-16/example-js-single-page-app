/* Must have -- MVP (minimum viable product) */
// need to show a list of existing todos
const url = 'http://localhost:3000/todos'
const todoList = document.getElementById('todo-list')
const form = document.getElementById('todo-form')

function listTodos() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // take all the todos
      // loop through and create a new todo item on the page for each one
      for (let todoObj of data) {
        renderTodoItem(todoObj)
      }
    })
}

form.addEventListener('submit', function () {
  event.preventDefault()
  // grab the value from the input
  const todoText = document.querySelector('#todo-text').value
  // send it to the server to create a new todo
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      item: todoText,
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
})


// I'm doing this work in more than one place, so it's helpful to put it in a function rather than repeat it!
function renderTodoItem(todoObj) {
  const itemEl = document.createElement('li')
  itemEl.id = todoObj.id
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
    itemEl.innerHTML = `<span class="dib w-60">${todoObj.item}</span><i class="ml2 dark-red fas fa-times delete"></i><i class="ml3 fas fa-edit edit"></i>`
    todoList.appendChild(itemEl)

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
