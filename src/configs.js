const fs = require('fs');
var path = require('path');
const yaml = require('js-yaml');
var logger = require('../LogConfig');

let appProps = {};
try {
    var filename = path.join(__dirname, 'resources/application.yml');
    let fileContents = fs.readFileSync(filename, 'utf8');
    let appProperties = yaml.safeLoad(fileContents);

    appProps = {
        config : {
            PORT : process.env.PORT || appProperties.api.port,
            MONGO_URL : process.env.MONGO_URL || appProperties.database.mongodb.url,
            CLOUDKARAFKA_TOPIC: process.env.CLOUDKARAFKA_TOPIC || appProperties.queue.kafka.CLOUDKARAFKA_TOPIC,
            CLOUDKARAFKA_BROKERS: process.env.CLOUDKARAFKA_BROKERS || appProperties.queue.kafka.CLOUDKARAFKA_BROKERS,
            CLOUDKARAFKA_USERNAME: process.env.CLOUDKARAFKA_USERNAME || appProperties.queue.kafka.CLOUDKARAFKA_USERNAME,
            CLOUDKARAFKA_PASSWORD: process.env.CLOUDKARAFKA_PASSWORD || appProperties.queue.kafka.CLOUDKARAFKA_PASSWORD,
            CLOUDKARAFKA_PASSWORD: process.env.CLOUDKARAFKA_PASSWORD || appProperties.queue.kafka.CLOUDKARAFKA_PASSWORD,
            MQTT_HOST: process.env.MQTT_HOST || appProperties.mqtt.MQTT_HOST,
        },
        properties: appProperties
    }
} catch (e) {
    logger.error(e);
}

module.exports = appProps;