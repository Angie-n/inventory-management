const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Pokemon = require('./pokemon');

const dateFormatter = require('../public/javascripts/dateConverter');

const PokemonInstanceSchema = new Schema(
    {
        pokemon: {type: Schema.Types.ObjectId, ref: "Pokemon", required: true},
        status: { type: String, required: true, enum: ['Available', 'Adopted', 'Undergoing Rehabilitation', 'Fainted'], default: 'Undergoing Rehabilitation' },
        birth_date: { type: Date, default: null },
        date_received: { type: Date, default: Date.now },
        nature: {type: Schema.Types.ObjectId, ref: "Nature", required: true, default: null}
    }
);

PokemonInstanceSchema
  .virtual('url')
  .get(function() {
    return '/catalog/pokemoninstance/' + this.id;
  });

PokemonInstanceSchema
  .virtual('birth_date_format_input')
  .get(function() {
    return dateFormatter.toInputFormat(this.birth_date);
  });

PokemonInstanceSchema
  .virtual('date_received_format_input')
  .get(function() {
    return dateFormatter.toInputFormat(this.date_received);
  });

PokemonInstanceSchema.pre('save', function (next) {
  this.wasNew = this.$isNew;
  next();
})

//Updates number_in_stock every time a new pokemoninstance is created for that pokemon
PokemonInstanceSchema.post('save', function(pokemonInstance, next) {
  if(this.wasNew) {
    Pokemon.findById(pokemonInstance.pokemon)
      .exec((err, pokemonResult) => {
        if(err) next(err);
        pokemonResult.number_in_stock += 1;
        pokemonResult.save();
      })
  }
  next();
})

PokemonInstanceSchema.pre('remove', function (next) {
  Pokemon.findById(this.pokemon)
    .exec((err, pokemonResult) => {
      if(err) next(err);
      else if (pokemonResult == null) next();
      else {
        pokemonResult.number_in_stock -= 1;
        pokemonResult.save();
        next();
      }
    })
})

PokemonInstanceSchema.pre('deleteMany', function (next) {
  Pokemon.findById(this.pokemon)
    .exec((err, pokemonResult) => {
      if(err) next(err);
      else if (pokemonResult == null) next();
      else {
        pokemonResult.number_in_stock -= 1;
        pokemonResult.save();
        next();
      }
    })
})

module.exports = mongoose.model('PokemonInstance', PokemonInstanceSchema);