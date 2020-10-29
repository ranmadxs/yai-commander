# yai-commander

API para domótica y control de PC

## Instakar

npm install

## Correr local

nodemon index.js

## Example create event
```bash
curl -X POST "http://localhost:8081/event/create" -H  "accept: application/json" -d "code=xdddd&name=example"
```
### Example kafka client

```bash
export CLOUDKARAFKA_BROKERS=tricycle-01.srvs.cloudkafka.com:9094,tricycle-02.srvs.cloudkafka.com:9094,tricycle-03.srvs.cloudkafka.com:9094
export CLOUDKARAFKA_USERNAME=1xpbgxp5
export CLOUDKARAFKA_PASSWORD=YBepu9SHThb2LE90mvnozsDCfnsmUXxq
export CLOUDKARAFKA_TOPIC=1xpbgxp5-ya
```