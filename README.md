# Task Manager Application

This is a Task Manager application built with React (frontend) and Node.js/Express (backend) using MongoDB as the database. The app supports creating, updating, deleting tasks with priority levels (low, medium, high), filtering by status, searching, pagination, and push notifications using the Push API and Service Workers.

## Features
1. Create, update, delete tasks with priority levels.
2. Search and filter tasks by name, status (pending/completed), and         priority.
3. Pagination for displaying tasks.
4. Push notifications via the Push API and Service Workers.
## Tech Stack
1. Frontend: React, Axios
2. Backend: Node.js, Express, Mongoose
3. Database: MongoDB
4. Push Notifications: Push API, Service Workers
## Prerequisites
Before setting up the project, ensure you have the following installed:
1. Node.js: >= 14.x
2. MongoDB Atlas (or a local MongoDB instance)
3. npm (comes with Node.js)
4. A modern web browser that supports Service Workers and Push API          (e.g., Chrome, Firefox)
## Setup Instructions
1. Clone the repository:
   git clone https://github.com/yourusername/task-manager.git
2. Set up the backend (Node.js/Express)
   Install the dependencies:
   npm install
   Configure the environment variables:
   Create a .env file in the backend directory and add your MongoDB URI      and VAPID keys (for push notifications)
   
   You can generate VAPID keys using the web-push package:

   node -e "console.log(require('web-push').generateVAPIDKeys())"
   Start the backend server:

   npm start
   The backend will start on http://localhost:5000.

3. Set up the frontend (React)
   Navigate to the frontend directory:
   Install the dependencies:
   npm install
   Update the API URL in the frontend:

   Open TaskList.js in the src directory and ensure the API URL is set to    your backend endpoint:
   const API_URL = 'http://localhost:5000/tasks';
   Start the React development server:
   npm start
   The React app will run at http://localhost:3000.

4. Testing Push Notifications
   Ensure you have HTTPS enabled for push notifications. To test this        locally, use a tool like ngrok to create a secure tunnel:

   ngrok http 3000
   Then, update the API_URL and open the secure URL provided by ngrok.

   Subscribe to push notifications by clicking the "Subscribe to Push        Notifications" button in the frontend UI.

5. MongoDB Setup (Local or Atlas)
   If you're using MongoDB Atlas, ensure your MongoDB URI is correctly       configured in the .env file.
   If you're using a local MongoDB instance, update your .env file to        point to your local MongoDB connection
