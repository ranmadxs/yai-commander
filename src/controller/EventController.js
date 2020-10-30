const _ = require('lodash');
var express = require('express');
var router = express.Router();
const logger = require('../../LogConfig');
const eventSvc = require('../svc/EventSvc');
const { check, validationResult } = require('express-validator');
const YaiError = require  ('../utils/YaiError');
const kafkaFactory = require('../factories/KafkaFactory');

logger.info("Event Controller", "[CTRL_INIT]");

router.post('/create', [
    check('code').exists(),
    check('name').exists(),
  ], async (req, res) => {
    logger.debug(req.body, 'req.body [/create]');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    logger.debug('Lolaso la pezcada');
    const { body } = req;
    let result = null;
    try {
        result = await eventSvc.create(body);
        kafkaFactory.send(JSON.stringify(result));
        console.log (result, 'result');
      } catch(ex) {
        logger.error(ex);
        return res.status(_.isEmpty(ex)?500:ex.code).json(_.isEmpty(ex)?{ error: ex.message }:ex);
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(result));
});

router.post('/test', [], async (req, res) => {
  logger.debug(req.body, 'req.body [/create]');
  logger.debug('Test del terror');
  const result = { status: 'OK', valid: true };
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result));
});

module.exports = router;