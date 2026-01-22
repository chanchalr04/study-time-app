const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  taskValidator,
  idValidator
} = require('../utils/validators');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  markTaskComplete
} = require('../controllers/task.controller');

router.use(auth);

router.route('/')
  .post(taskValidator, validate, createTask)
  .get(getTasks);

router.route('/:id')
  .get(idValidator, validate, getTask)
  .put(idValidator, taskValidator, validate, updateTask)
  .delete(idValidator, validate, deleteTask);

router.put('/:id/complete', idValidator, validate, markTaskComplete);

module.exports = router;