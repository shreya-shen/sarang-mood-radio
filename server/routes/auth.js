const express = require('express');
const { handleOAuthRedirect, getUserSession } = require('../controllers/authController');
const router = express.Router();

router.get('/oauth/callback', handleOAuthRedirect);
router.get('/session', getUserSession);

module.exports = router;