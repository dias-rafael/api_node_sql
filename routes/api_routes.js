const express = require('express');
const controller = require('../controller/api_controller');
const router = express.Router();
const auth = require('./auth');

//GET API
router.get('/', auth.required, controller.showIndex);

router.get('/api/tarifapadrao', auth.required, controller.getTarifas);

module.exports = router;