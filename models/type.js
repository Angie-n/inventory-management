const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Type = new Schema(
    {
        name: {type: String, required: true, min: 3, max: 100, unique: true},
        is_verified: {type: Boolean, default: false}
    }
);

Type
  .virtual('url')
  .get(function() {
    return '/catalog/type/' + this.id;
  });

module.exports = mongoose.model("Type", Type)