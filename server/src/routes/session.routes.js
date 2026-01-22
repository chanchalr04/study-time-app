const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  sessionValidator,
  idValidator
} = require('../utils/validators');
const {
  startSession,
  getSessions,
  getSession,
  endSession,
  deleteSession
} = require('../controllers/session.controller');

router.use(auth);

router.route('/')
  .post(sessionValidator, validate, startSession)
  .get(getSessions);

router.route('/:id')
  .get(idValidator, validate, getSession)
  .delete(idValidator, validate, deleteSession);

router.post('/:id/end', idValidator, validate, endSession);

module.exports = router;