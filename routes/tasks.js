// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const authMiddleware = require('../middleware/auth');

// Middleware to protect routes
router.use(authMiddleware);

// Get all tasks for a user
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Could not get tasks' });
  }
});

// Add a new task
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      user: req.userId,
    });
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ error: 'Could not add task' });
  }
});

// Update a task
router.patch('/tasks/:id', async (req, res) => {
  try {
    const { title, description, dueDate, completed } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, description, dueDate, completed },
      { new: true }
    );
    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: 'Could not update task' });
  }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete task' });
  }
});

module.exports = router;
