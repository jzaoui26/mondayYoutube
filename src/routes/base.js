const express = require('express');
const router = express.Router();

const baseController = require('../controllers/base-controller.js');
const authenticationMiddleware = require('../middlewares/authentication').authenticationMiddleware;

router.post('/updateItem', authenticationMiddleware, baseController.updateItem);
router.post('/updateBoard', authenticationMiddleware, baseController.updateBoard);

module.exports = router;

