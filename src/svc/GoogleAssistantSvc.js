var logger = require('../../LogConfig');
var GoogleAssistant = require ('../schemas/GoogleAssistantSchema');
const YaiError = require  ('../utils/YaiError');

class GoogleAssistantSvc {
  constructor() {
    if(! GoogleAssistantSvc.instance) {
      GoogleAssistantSvc.instance = this;
      logger.debug("GoogleAssistant SVC", "[SVC_INSTANCE]");
    }
    return GoogleAssistantSvc.instance;
  }

  async create (jsonObject) {
    logger.info("Se esta ingresando un google assistent nuevo", jsonObject.responseId);
    let saveEvent = null;
    try {
      var event = new GoogleAssistant.model({request: JSON.stringify(jsonObject)});
      saveEvent = await event.save();
    } catch (err) {
      console.error('la wea el error gassitant');
      throw new YaiError(err.message, 424, 'GoogleAssistantSvcError');
    }
    return saveEvent;
  }
};

const instance = new GoogleAssistantSvc();
Object.freeze(instance);
module.exports = instance;