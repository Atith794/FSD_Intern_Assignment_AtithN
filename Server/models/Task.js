const mongoose = require('mongoose');

// Task Schema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;