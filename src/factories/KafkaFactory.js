var logger = require('../../LogConfig');
var appProps = require ('../configs');
// const { Kafka } = require('kafkajs');
// const Kafka = require('no-kafka');
const Kafka = require("node-rdkafka");


class KafkaFactory {
    constructor(){
        //this.connect();
        logger.debug("Connection Kafka Factory", "[KAFKA_INIT]");
    }

    async run () {
      await this.producer.connect();
      //setInterval(sendMessage, 3000)
    }

    send(msg) {
      this.producer.produce(this.defaultTopic, -1, this.genMessage(msg), 1);
    }

    async connect() {
        const uristring = this.url;
        logger.debug('Init kafka connect');
        logger.debug(Kafka.librdkafkaVersion);
        return new Promise(async (resolve, reject) => {
          const kafkaConf = {
            "group.id": appProps.config.CLOUDKARAFKA_USERNAME+"-consumer",
            "bootstrap.servers": appProps.config.CLOUDKARAFKA_BROKERS,  
            "security.protocol": "SASL_SSL",
            "sasl.mechanisms": "SCRAM-SHA-256",
            "sasl.username": appProps.config.CLOUDKARAFKA_USERNAME,
            "sasl.password": appProps.config.CLOUDKARAFKA_PASSWORD,
            "debug": "generic,broker,security"
          };
          
          this.defaultTopic = appProps.config.CLOUDKARAFKA_TOPIC;
          this.producer = new Kafka.Producer(kafkaConf);
          const maxMessages = 20;
          
          this.genMessage = msg => new Buffer(`${msg}`);
          
          this.producer.on("ready", (arg) => {
            logger.info ('Kafka [ON] Succeeded connected to: ');
            this.producer.produce(this.defaultTopic, -1, this.genMessage('PING'), 1);
            resolve({ kafka: true });
          });
          
          this.producer.on("disconnected", function(arg) {
            logger.warn("disconected kafka");
            process.exit();
          });
          
          this.producer.on('event.error', function(err) {
            logger.error(err);
            process.exit(1);
          });

          this.producer.on('event.log', function(log) {
          //  console.log(log);
          });
          
          this.run();
        });
    }

};
const instance = new KafkaFactory();
//Object.freeze(instance);
module.exports = instance;