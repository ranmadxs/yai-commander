require('dotenv').config();
require('./src/banner');

const express = require('express');
const app = express();
var logger = require('./LogConfig');
var cors = require('cors');
/***** LIbs Swagger *******/
var YAML = require('yamljs');
var swaggerUi = require('swagger-ui-express');
var bodyParser = require('body-parser');
//var swaggerDocument = YAML.load('./doc/swagger.yaml');
var multer = require('multer');
var upload = multer();
var appProps = require ('./src/configs');

/*** Controladores */
var eventController = require('./src/controller/EventController');

/** Factorías */
var loadSwagger = require('./loadSwagger');
var mongoFactory = require('./src/factories/MongoConnectionFactory');
var kafkaFactory = require('./src/factories/KafkaFactory');
var mqttFactory = require('./src/factories/MqttFactory');

logger.debug (appProps);

app.use(
    cors({
        credentials: true,
        origin: true
    })
    );
app.options('*', cors());

app.get('/', (req, res) => 
    res.redirect('/api-docs')
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/event', eventController);

app.listen(appProps.config.PORT, async () => {
    logger.debug("mth40-api starting on port="+appProps.config.PORT);
    const docSample = await loadSwagger.load('./doc/index.yaml');
    const swaggerDocument = YAML.parse(docSample);
    const mongoPromised = mongoFactory.connect();
    const kafkaPromised = kafkaFactory.connect();
    const mqttPromised = mqttFactory.connect();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    Promise.all([mongoPromised, kafkaPromised, mqttPromised]).then(respVal => {
        console.log("********************************************************");
        console.log(respVal);
        console.log('************* Server running on port ' + appProps.config.PORT + " **************");
        console.log("********************************************************");
    }).catch(reason => { 
        logger.error(reason);
    });
});