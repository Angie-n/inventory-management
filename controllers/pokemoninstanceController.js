const PokemonInstance = require('../models/pokemoninstance');

exports.pokemonInstance_list = (req, res) => {
    PokemonInstance.find()
        .sort({status: 1})
        .populate('pokemon')
        .exec((err, result) => {
            if(err) return err;
            res.render('pokemoninstance_list', {pokemoninstance_list: result});
        })
}

exports.pokemonInstance_detail = (req, res) => {
    PokemonInstance.findById(req.params.id)
        .populate('nature')
        .populate('pokemon')
        .exec((err, result) => {
            if(err) return err;
            res.render('pokemoninstance_detail', {pokemoninstance: result});
        })
}