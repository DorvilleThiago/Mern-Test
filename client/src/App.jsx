import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3001";

function App() {

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  }

  const CompleteTodo = async id => {
    const data = await fetch(API_BASE + "/todo/complete/" + id)
      .then(res => res.json());

    setTodos(todos => todos.map(todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete;
      }
      return todo;
    }));
  }

  return (
    <div className="App">

      <h1>Your Tasks</h1>

      <div className="todos">

        {todos.map(todo => (
          <div onClick={() => CompleteTodo(todo._id)} className={"todo" + (todo.complete ? " is-complete" : "")} key={todo._id}>
            <div className="checkbox"></div>
            <h2 className="text">{todo.text}</h2>
            <div className="delete-todo"></div>
          </div>
        ))}

      </div>

    </div>
  )
}

export default App
