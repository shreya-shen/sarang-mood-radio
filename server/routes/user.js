const express = require('express');
const requireAuth = require('../utils/clerkAuth');
const { createUser, getUser, setInitialUsername } = require('../controllers/userController');
const router = express.Router();

router.post('/create', requireAuth, createUser);
router.post('/set-username', requireAuth, setInitialUsername);
router.get('/profile', requireAuth, getUser);

module.exports = router;
