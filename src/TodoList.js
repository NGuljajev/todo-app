import React, { useState, useEffect, useCallback } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const token = localStorage.getItem('access_token');

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('http://demo2.z-bit.ee/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async () => {
    try {
      const response = await fetch('http://demo2.z-bit.ee/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTask, desc: '' }),
      });
      if (response.ok) {
        fetchTasks();
        setNewTask('');
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://demo2.z-bit.ee/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const toggleTask = async (id, marked_as_done) => {
    try {
      await fetch(`http://demo2.z-bit.ee/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ marked_as_done: !marked_as_done }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  return (
    <div>
      <h2>Ülesannete nimekiri</h2>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Lisa uus ülesanne"
      />
      <button onClick={addTask}>Lisa</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.marked_as_done ? 'line-through' : 'none',
              }}
              onClick={() => toggleTask(task.id, task.marked_as_done)}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>Kustuta</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;