var mongoose = require ("mongoose");

var googleAssistantSchema = new mongoose.Schema({
    request: { type: String, trim: true, required: true },
    createdAt: { type: Date, default: Date.now },
});

const model = mongoose.model('googleAssistant', googleAssistantSchema);

module.exports = {
  model,
  schema: googleAssistantSchema
}