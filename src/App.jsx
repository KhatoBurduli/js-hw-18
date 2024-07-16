import { useEffect, useState } from 'react';
import './App.css';
import TasksForm from './components/TasksForm';

const apikey = 'eFrCE_M0tirMW7DH-z2NrdSvoqb5mNLWuTsnqK9eE2phjBk4gg';

function App() {
  const [taskList, setTaskList] = useState([]);

  useEffect(() => {
    fetch('/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apikey}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Response Failed');
        return res.json();
      })
      .then((data) =>
        setTaskList(
          data.items.map((task) => ({
            task: task.task,
            id: task._uuid,
            completed: task.completed || false, // Assuming your API returns a completed status
          }))
        )
      )
      .catch((err) => console.log(err));
  }, []);

  const onFormSubmit = (task) => {
    fetch('/api/v1/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apikey}`,
      },
      body: JSON.stringify([{ task }]),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Response Failed');
        return res.json();
      })
      .then((data) =>
        setTaskList((prev) => [
          {
            task: data.items[0].task,
            id: data.items[0]._uuid,
            completed: data.items[0].completed || false, // Adjust based on your API response
          },
          ...prev,
        ])
      )
      .catch((err) => console.log(err));
  };

  const handleComplete = (taskId) => {
    const updatedTasks = taskList.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updatedTasks);
    // Update API with new task status
    fetch(`/api/v1/users/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        completed: !taskList.find((task) => task.id === taskId).completed,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Response Failed');
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <TasksForm onFormSubmit={onFormSubmit} />
      <button onClick={() => setTaskList([])}>clear tasks</button>

      {taskList.map((task) => (
        <div key={task.id} style={{ border: '1px solid gray' }}>
          <h3>{task.task}</h3>
          <button onClick={() => handleComplete(task.id)}>
            {task.completed ? 'Completed' : 'Mark as Completed'}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;

