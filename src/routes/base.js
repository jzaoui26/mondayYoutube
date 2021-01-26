const express = require('express');
const router = express.Router();

const baseController = require('../controllers/base-controller.js');
const authenticationMiddleware = require('../middlewares/authentication').authenticationMiddleware;


router.post('/statistic-subscribe', authenticationMiddleware, baseController.subscribeStatistic);
router.post('/statistic-unsubscribe', authenticationMiddleware, baseController.unsubscribeStatistic);
router.post('/updateEntityStats', authenticationMiddleware, baseController.updateStatistic);
router.post('/fieldDefs', authenticationMiddleware, baseController.getFieldDefs);

module.exports = router;

