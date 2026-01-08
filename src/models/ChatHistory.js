const mongoose = require("mongoose");
const AnswerBlockSchema = new mongoose.Schema(
  {
    text: String,          
    sources: [String],     
  },
  { _id: false }
);

const ChatHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },

  query: {
    type: String,
    required: true
  },

  
  response: {
    type: String,
    required: true
  },

  
  answerBlocks: {
    type: [AnswerBlockSchema],
    default: []
  },

 
  sources: {
    type: [String],
    default: []
  },

  
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  },

  
  mode: {
    type: String,
    enum: ["normal", "simulated-stream"],
    default: "normal"
  },

  askedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model("ChatHistory", ChatHistorySchema);
