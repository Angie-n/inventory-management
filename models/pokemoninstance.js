const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PokemonInstanceSchema = new Schema(
    {
        pokemon: {type: Schema.Types.ObjectId, ref: "Pokemon", required: true},
        status: { type: String, required: true, enum: ['Available', 'Adopted', 'Undergoing Rehabilitation', 'Fainted'], default: 'Undergoing Rehabilitation' },
        birth_date: { type: Date, default: null },
        date_received: { type: Date, default: Date.now },
        nature: {type: Schema.Types.ObjectId, ref: "Nature", default: null}
    }
);

PokemonInstanceSchema
  .virtual('url')
  .get(function() {
    return '/catalog/pokemoninstance/' + this.id;
  });

module.exports = mongoose.model('PokemonInstance', PokemonInstanceSchema);