var logger = require('../../LogConfig');
var Event = require ('../schemas/EventSchema');
const YaiError = require  ('../utils/YaiError');

class EventSvc {
  constructor() {
    if(! EventSvc.instance) {
      EventSvc.instance = this;
      logger.debug("Event SVC", "[SVC_INSTANCE]");
    }
    return EventSvc.instance;
  }

  async create (jsonObject) {
    logger.info("Se esta ingresando un evento nuevo", jsonObject.code);
    let saveEvent = null;
    try {
      var event = new Event.model(jsonObject);
      saveEvent = await event.save();
    } catch (err) {
      console.error('la wea el error');
      throw new YaiError(err.message, 424, 'EventSvcError');
    }
    return saveEvent;
  }
};

const instance = new EventSvc();
Object.freeze(instance);
module.exports = instance;