// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const taskRoutes = require('./routes/taskRoutes');

// const app = express();
// const PORT = 5000;

// // MongoDB connection
// mongoose.connect("mongodb+srv://atith:12345@cluster0.6hengam.mongodb.net/todomanager", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.error('Error connecting to MongoDB', err);
// });

// // Middleware
// app.use(cors()); // Allows requests from frontend
// app.use(express.json()); // Parses JSON bodies

// // Routes
// app.use('/tasks', taskRoutes);

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const webPush = require('web-push');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 5000;

// MongoDB connection
mongoose.connect("mongodb+srv://atith:12345@cluster0.6hengam.mongodb.net/todomanager", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

// Middleware
app.use(cors());
app.use(express.json());

// VAPID keys from earlier generation
const publicVapidKey = 'BKv_OxEWpvc920zDl4w7AJaSnEOToqMdH-ovxEhAycAWrFihqpmi3-76PqxbEXHGCfhcB3cg3icexHPYHr3GLI0';
const privateVapidKey = 'BJsBZRl3X3UADJ1X5BmX5z2AjjdzTtuOdZHizGVSaSk';

// Configure web-push with VAPID keys
webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

// In-memory subscription store (for simplicity; you can store this in a database)
let subscriptions = [];

// Subscribe route to store subscription objects
app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  // Store subscription
  subscriptions.push(subscription);

  res.status(201).json({ message: 'Subscribed successfully!' });
});

// Send notification (This could be triggered when a task is created or completed)
app.post('/send-notification', (req, res) => {
  const notificationPayload = {
    title: 'Task Manager',
    body: 'A task has been updated or created.',
  };

  // Send push notification to all subscribed clients
  const promises = subscriptions.map(subscription => {
    return webPush.sendNotification(subscription, JSON.stringify(notificationPayload));
  });

  Promise.all(promises)
    .then(() => res.status(200).json({ message: 'Push notifications sent successfully.' }))
    .catch(error => {
      console.error('Error sending push notifications', error);
      res.status(500).json({ message: 'Error sending push notifications' });
    });
});

// Routes
app.use('/tasks', taskRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
