var logger = require('../../LogConfig');
var yaiCfg = require ('../configs');
var mqtt    = require('mqtt');

class MqttFactory {
  constructor(){
    this.host = yaiCfg.config.MQTT_HOST;
    this.mainTopic = yaiCfg.properties.mqtt.MQTT_MAIN_TOPIC;
    this.connected = false;
    logger.debug("Mqtt Connection Factory", "[MQTT_INIT]");
  }

  async connect() {
    this.client  = mqtt.connect(this.host);
    let promise = new Promise((resolve, reject) => {
      this.client.on("error", function(error) {
          logger.error(error);
          reject (error);
      });
      this.client.on("connect", () => {
          this.client.subscribe(this.mainTopic);
          logger.info("Mqtt Connected [OK] to: " + this.host);
          this.connected = true;
          resolve ({mqtt: true});
      });
      this.client.on('message', function (topic, message) {
        logger.debug("[MQTT]>> " + message.toString());
      });      
    });
    return promise;
  }

  async send(message) {
    if(this.connected) {
      this.client.publish(this.mainTopic, message);
    }
  }
};
const instance = new MqttFactory();
//Object.freeze(instance);
module.exports = instance;  