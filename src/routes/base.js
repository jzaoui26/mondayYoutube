const express = require('express');
const router = express.Router();

const baseController = require('../controllers/base-controller.js');
const authenticationMiddleware = require('../middlewares/authentication').authenticationMiddleware;

/*
router.post('/updateEntityStats', authenticationMiddleware, baseController.updateStatistic);
*/
router.post('/updateFields', authenticationMiddleware, baseController.updateFields);
/*
router.post('/fieldDefs', authenticationMiddleware, baseController.getFieldDefs);
router.post('/updateSubscribe', authenticationMiddleware, baseController.subscribeUpdate);
router.post('/updateUnsubscribe', authenticationMiddleware, baseController.unsubscribeUpdate);
router.post('/updateStatistic', authenticationMiddleware, baseController.updateStatistic);
router.post('/updateStatFinal', authenticationMiddleware, baseController.updateStatFinal);
router.post('/ticketSubscribe', authenticationMiddleware, baseController.ticketSubscribe);
router.post('/ticketUnsubscribe', authenticationMiddleware, baseController.ticketUnsubscribe);
router.get('/test', baseController.fetchTest);*/

module.exports = router;

