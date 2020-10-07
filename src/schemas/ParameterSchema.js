var mongoose = require ("mongoose");

const parameterSchema = new mongoose.Schema({
  name: { type: String },
  value: { type: String },
});

const model = mongoose.model('Parameter', parameterSchema);

module.exports = {
  model,
  schema: parameterSchema
}