const express = require('express');
const {sendMessage,getMessages} = require('../controllers/messagecontrollers');
const protectRoute = require('../middleware/protectRoute');


const router = express.Router();

router.get('/:id', protectRoute,getMessages);

router.post('/send/:id', protectRoute,sendMessage);

module.exports = router;