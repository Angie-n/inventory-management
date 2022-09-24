const { body, validationResult } = require("express-validator");
const Type = require('../models/type');
const Pokemon = require('../models/pokemon');
const PokemonInstance = require('../models/pokemoninstance');

exports.type_list = (req, res) => {
    Type.find({}, 'name url')
        .sort({name: 1})
        .exec((err, result) => {
            if(err) return err;
            res.render('list', {title: "Type List", list: result})
        });
}

exports.type_detail = (req, res) => {
    Type.findById(req.params.id)
        .exec((err, typeResult) => {
            if(err) return err;
            Pokemon.find({types: typeResult})
                .exec((err, pokemonResult) => {
                    if(err) return err;
                    res.render('type_detail', {type: typeResult, pokemon: pokemonResult})
                })
        })
}

exports.type_create_get = (req, res) => {
    res.render('type_form', {title: "Create Type"});
}

exports.type_create_post = [
    body('name', "Name must not be empty.")
        .trim()
        .isLength({min: 1})
        .escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        const type = new Type({name: req.body.name});

        if (!errors.isEmpty()) {
            res.render("type_form", {
                title: "Create Type",
                type,
                errors: errors.array(),
              });
            return;
        }

        type.save((err) => {
            if(err) return err;
            res.redirect(type.url);
        })
    }
];

exports.type_delete_get = (req, res) => {
    Type.findById(req.params.id)
        .exec((err, typeResult) => {
            if(err) return err;
            Pokemon.find({types: typeResult})
                .exec((err, pokemonResults) => {
                    if(err) return err;
                    PokemonInstance.find({pokemon: {$in: pokemonResults}})
                        .exec((err, pokemonInstanceResults) => {
                            if(err) return err;
                            res.render('delete', {title: 'Delete Type', mainDeletion: typeResult, otherDeletions: [{name: "Pokemon", list: pokemonResults}, {name: "Pokemon Instances", list: pokemonInstanceResults}], numDeletions: 1 + pokemonResults.length + pokemonInstanceResults.length});
                        })
                })
        })
}

exports.type_delete_post = (req, res) => {
    Type.findById(req.body.id)
        .exec((err, typeResult) => {
            if(err) return err;
            Pokemon.find({types: typeResult})
                .exec((err, pokemonResults) => {
                    if(err) return err;
                    Promise.all([
                        typeResult.remove(),
                        PokemonInstance.deleteMany({pokemon: {$in: pokemonResults}})
                    ])
                    .then(() => {
                        pokemonResults.forEach(pokemon => pokemon.remove());
                        res.redirect("/catalog/type");
                    })
                    .catch(err => err);
                })
        })
}