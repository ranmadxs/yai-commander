var mongoose = require ("mongoose");
var ParameterSchema = require("./ParameterSchema");

var eventSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    code: { type: String, trim: true, required: true },
    command: { type: String, trim: true, required: false },
    parameters: [ParameterSchema.schema],
    triggerDate: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now },
});

const model = mongoose.model('Event', eventSchema);

module.exports = {
  model,
  schema: eventSchema
}