const _ = require('lodash');
var express = require('express');
var router = express.Router();
const logger = require('../../LogConfig');
const eventSvc = require('../svc/EventSvc');
const googleAssistantSvc = require('../svc/GoogleAssistantSvc');
const { check, validationResult } = require('express-validator');
const YaiError = require  ('../utils/YaiError');
const kafkaFactory = require('../factories/KafkaFactory');
var RuleEngine = require("node-rules");

logger.info("Event Controller", "[CTRL_INIT]");
var R = new RuleEngine();

/* Add a rule */
var rule = {
  "condition": function(R) {
      logger.debug(this);
      R.when(this.transactionTotal < 500);
  },
  "consequence": function(R) {
      this.result = false;
      this.reason = "The transaction was blocked as it was less than 500";
      R.stop();
  }
};

/* Register Rule */
R.register(rule);

/* Add a Fact with less than 500 as transaction, and this should be blocked */
var fact = {
  "name": "user4",
  "application": "MOB2",
  "transactionTotal": 4500,
  "cardType": "Credit Card"
};


router.get('/rule', async (req, res) => {
  logger.debug('Inicio motor de reglas', 'Reglas');
  let result = 'Resultado de la regla';
  R.execute(fact, function (data) {
    if (data.result) {
      resultado = 'Valid transaction';
      logger.info(resultado);
    } else {
      resultado = "Blocked Reason:" + data.reason;
      logger.debug("Blocked Reason:" + data.reason);
    }
  });

  logger.debug('Fin motor de reglas', 'Reglas');
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result));

});


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
    logger.info(body.parameters, 'parameters');
    if (body.parameters) {
      logger.info(JSON.parse(body.parameters), 'paramObj');
      body.parameters = JSON.parse(body.parameters);
    }
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



const validateGoogleAssistantObject = (googleAssistantObject) => {
  let isValid = false;
  let msg = "";
  if (!_.isEmpty(googleAssistantObject)) {     
    //const googleAssistantObject = JSON.parse(str);
    if ("queryResult" in googleAssistantObject && "parameters" in googleAssistantObject.queryResult) {
      logger.info('lolasooooooooooooooooooooooooooooooooooooooooooooooooooooo');
      logger.debug(googleAssistantObject.queryResult.parameters, 'googleAssistantObject.queryResult.parameters');
      isValid = true;
    }
  }
  return {isValid, msg};
};

router.post('/googleAsisst', [], async (req, res) => {
 // logger.debug(req.body, 'req.body [/googleAsisst]');
  logger.debug('Test del terror');
  // const result = { status: 'OK', valid: true };
  validateGoogleAssistantObject(req.body);
  googleAssistantSvc.create(req.body);
  const result = 
  {
    "payload": {
      "google": {
        "expectUserResponse": false,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": "Orden completada correctamente"
              }
            }
          ]
        }
      }
    }
  };
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result));
});

router.post('/test', [], async (req, res) => {
  logger.debug(req.body, 'req.body [/test]');
  logger.debug('Test del terror');
  // const result = { status: 'OK', valid: true };
  googleAssistantSvc.create(req.body);
  const result = 
  {
    "payload": {
      "google": {
        "expectUserResponse": false,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": "Orden completada correctamente"
              }
            }
          ]
        }
      }
    }
  };
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result));
});

module.exports = router;