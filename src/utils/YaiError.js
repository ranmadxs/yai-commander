module.exports = class YaiError extends Error {
  constructor(message, code, type) {
    super(message);
    this.code = code;
    this.type = type;
    this.msg = message;
  }
}