const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const format_date = require('../utils/helper');


const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      min_length: 1,
      max_length: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: format_date,
    },
    username: {
      type: String,
      required: true,      
    },
    // Array of nested documents created with the reactionSchema
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

// a virtual called reactionCount that retrieves the length of the user's friends array field on query.
thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;