const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PokemonSchema = new Schema(
  {
    name: {type: String, required: true, maxLength: 100},
    price: {type: Number, required: true, min: 0},
    numberInStock: {type: Number},
    image: {type: String},
    types: {type: [Schema.Types.ObjectId], ref: 'Type',  required: true},
    weight: {type: Number, min: 0},
    height: {type: Number, min: 0},
    isVerified: {type: Boolean}
  }
);

module.exports = mongoose.model("Pokemon", PokemonSchema);