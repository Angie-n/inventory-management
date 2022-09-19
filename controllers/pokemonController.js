const Pokemon = require('../models/pokemon');
const PokemonInstance = require('../models/pokemoninstance');
const Type = require('../models/type');
const Nature = require('../models/nature');

exports.index = (req, res) => {
    Promise.all([
        Pokemon.countDocuments(),
        PokemonInstance.countDocuments(),
        Type.countDocuments(),
        PokemonInstance.countDocuments({status:'Available'}),
        PokemonInstance.countDocuments({status:'Adopted'}),
        Nature.countDocuments()

    ]).then(results => {
        let data = {
            pokemon_count: results[0],
            pokemonInstance_count: results[1],
            type_count: results[2],
            available_pokemonInstance_count: results[3],
            adopted_pokemonInstance_count: results[4],
            nature_count: results[5]
        }
        res.render('index', { title: "Pokedoption Index", data: data });
    }).catch(err => {
        res.render('index', { title: "Pokedoption Index", error: err });
    });
}

exports.pokemon_list = (req, res, next) => {
    Pokemon.find({}, 'name types image')
        .sort({name: 1})
        .populate('types')
        .exec((err, list_pokemon) => {
            if(err) return err;
            res.render('pokemon_list', {title: 'Pokemon List', pokemon_list: list_pokemon})
        })
}

exports.pokemon_detail = (req, res, next) => {
    Pokemon.findById(req.params.id)
        .populate('types')
        .exec((err, result) => {
            if(err) return err;
            res.render('pokemon_detail', {pokemon: result});
        })
}