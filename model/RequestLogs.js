const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestLogSchema = new mongoose.Schema({
    timestamp: {
      type: Date,
      default: Date.now
    },
    method: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      required: true
    },
    responseTime: {
      type: Number,
      required: true
    },
    ipAddress: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
  });
  
  module.exports = mongoose.model('RequestLog', requestLogSchema);