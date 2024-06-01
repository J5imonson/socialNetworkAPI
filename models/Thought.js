const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const moment = require('moment');

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 280,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    get: () => moment().format('MMMM Do YYYY, h:mm:ss a')
  },
  username: {
    type: String,
    required: true,
  },
  reaction: [
    reactionSchema
  ],
},
  {
    toJSON: {
      getters: true,
    },
    id: false,
  },
);

//retrieves the length of the thought's reaction array on query
thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reaction.length;
  })

const Thought = model("thought", thoughtSchema);

module.exports = Thought;