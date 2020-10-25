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
var mth40 = require ('./src/configs');

/*** Controladores */
var eventController = require('./src/controller/EventController');

/** Factorías */
var loadSwagger = require('./loadSwagger');
var mongoFactory = require('./src/factories/MongoConnectionFactory');

logger.debug (mth40);

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

app.listen(mth40.config.PORT, async () => {
    logger.debug("mth40-api starting on port="+mth40.config.PORT);
    const docSample = await loadSwagger.load('./doc/index.yaml');
    const swaggerDocument = YAML.parse(docSample);
    const mongoPromised = mongoFactory.connect();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    Promise.all([mongoPromised]).then(respVal => {
        console.log("********************************************************");
        console.log(respVal);
        console.log('************* Server running on port ' + mth40.config.PORT + " **************");
        console.log("********************************************************");
    }).catch(reason => { 
        logger.error(reason);
    });
});