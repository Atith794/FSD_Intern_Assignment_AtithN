import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskList.css';

const API_URL = 'http://localhost:5000/tasks';

const TaskList = () => {
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, completed
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter,setActivefilter] = useState('all');
  const [err,setErr] = useState(false);
  const [priority, setPriority] = useState('low'); // New priority state
  const [priorityFilter, setPriorityFilter] = useState('all'); // New priority filter
  const tasksPerPage = 5;

  useEffect(() => {
    // Register the service worker for push notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(swReg => {
          console.log('Service Worker registered', swReg);
        })
        .catch(error => {
          console.error('Service Worker Error', error);
        });
    }

    // Fetch all tasks from the backend
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };
    fetchTasks();
  }, []);

  // Subscribe to push notifications
  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BKv_OxEWpvc920zDl4w7AJaSnEOToqMdH-ovxEhAycAWrFihqpmi3-76PqxbEXHGCfhcB3cg3icexHPYHr3GLI0')
      });

      // Send the subscription object to the backend
      await axios.post('http://localhost:5000/subscribe', subscription);

      console.log('User subscribed to push notifications');
    } catch (error) {
      console.error('Failed to subscribe to notifications', error);
    }
  };

  // Utility to convert VAPID key from base64 string to Uint8Array
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Add a new task
  const handleAddTask = async () => {
    if(taskDescription.trim() === '') setErr(true);
    if (taskDescription.trim()) {
      try {
        const response = await axios.post(API_URL, { description: taskDescription,priority: priority});
        setTasks([...tasks, response.data]);
        setTaskDescription('');
        setPriority('low');
      } catch (error) {
        console.error('Error adding task', error);
      }
    }
  };

  // Complete a task
  const handleCompleteTask = async (id) => {
    try {
      const updatedTask = await axios.put(`${API_URL}/${id}`, { completed: true });
      setTasks(tasks.map(task => task._id === id ? updatedTask.data : task));
    } catch (error) {
      console.error('Error completing task', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (status) => {
    setActivefilter(status);
    setStatusFilter(status);
  };

  const handlePriorityFilterChange = (priority) => {
    setPriorityFilter(priority);
  };

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;

  // Apply search and status filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'completed' && task.completed) ||
                          (statusFilter === 'pending' && !task.completed);
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Paginate the filtered tasks
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Total number of pages
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleInputChange = (e) => {
    setTaskDescription(e.target.value)
    setErr(false);
  }

  return (
    <div className="task-container">
      <h1>Task List</h1>
      
      {/* Input for adding a new task */}
      
      <input
        type="text"
        value={taskDescription}
        onChange={handleInputChange}
        placeholder="Add a new task"
        required
      />

      {/* Priority selection */}
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-filter">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button onClick={handleAddTask}>Add Task</button>
      {err && alert("Please write something before adding")}

      {/* Search input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search tasks"
      />

      {/* Status filter */}
      <div className="status-filter">
        <button className={activeFilter==='all'?'active':''} onClick={() => handleStatusFilterChange('all')}>All</button>
        <button className={activeFilter==='pending'?'active':''} onClick={() => handleStatusFilterChange('pending')}>Pending</button>
        <button className={activeFilter==='completed'?'active':''} onClick={() => handleStatusFilterChange('completed')}>Completed</button>
      </div>

      <div className="priority-filter">
        <button onClick={() => handlePriorityFilterChange('all')}>All Priorities</button>
        <button onClick={() => handlePriorityFilterChange('low')}>Low</button>
        <button onClick={() => handlePriorityFilterChange('medium')}>Medium</button>
        <button onClick={() => handlePriorityFilterChange('high')}>High</button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {currentTasks.map((task) => (
          <li key={task._id} className={task.priority}>
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            {task.description} 
            </span>
            {!task.completed && (
              <button className="complete-btn" onClick={() => handleCompleteTask(task._id)}>Complete</button>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className = {currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Subscribe to Push Notifications */}
      <button onClick={subscribeToNotifications} className='pushButton'>Subscribe to Push Notifications</button>
    </div>
  );
};

export default TaskList;
