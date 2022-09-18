const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Nature = new Schema(
    {
        name: {type: String, required: true, min: 3, max: 100, unique: true},
        increased_stat: {type: String, min: 3, max: 100, default: null},
        decreased_stat: {type: String, min: 3, max: 100, default: null},
        likes_flavor: {type: String, min: 3, max: 100, default: null},
        hates_flavor: {type: String, min: 3, max: 100, default: null},
        is_verified: {type: Boolean, default: false}
    }
);

Nature
  .virtual('url')
  .get(function() {
    return '/catalog/nature/' + this.id;
  });

module.exports = mongoose.model("Nature", Nature)