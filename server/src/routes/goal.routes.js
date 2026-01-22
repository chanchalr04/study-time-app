const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  goalValidator,
  idValidator
} = require('../utils/validators');
const {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress
} = require('../controllers/goal.controller');

router.use(auth);

router.route('/')
  .post(goalValidator, validate, createGoal)
  .get(getGoals);

router.route('/:id')
  .get(idValidator, validate, getGoal)
  .put(idValidator, goalValidator, validate, updateGoal)
  .delete(idValidator, validate, deleteGoal);

router.put('/:id/progress', idValidator, validate, updateGoalProgress);

module.exports = router;