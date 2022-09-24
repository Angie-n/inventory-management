const { body, validationResult } = require("express-validator");
const PokemonInstance = require('../models/pokemoninstance');
const Pokemon = require('../models/pokemon');
const Nature = require('../models/nature');

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

const Status = (checked, value, id) => {
    return {checked, value, id}
}

const statuses = [Status(true, "Available", "available"), Status(false, "Adopted", "adopted"), Status(false, "Undergoing Rehabilitation", "undergoing_rehabilitation"), Status(false, "Fainted", "fainted")];

exports.pokemonInstance_create_get = (req, res) => {
    Pokemon.find({})
        .sort({name: 1})
        .exec((err, pokemonResult) => {
            if(err) return err;
            Nature.find({})
                .sort({name: 1})
                .exec((err, natureResult) => {
                    if(err) return err;
                    res.render('pokemoninstance_form', {title:"Create pokemoninstance", pokemon_list: pokemonResult, nature_list: natureResult, status_list: statuses});
                });
        });
}

exports.pokemonInstance_create_post = [
    body('pokemon').trim().escape(),
    body('status').trim().escape(),
    body('birth_date')
        .trim()
        .escape(),
    body('date_received', "Date received can't be earlier than the pokemon's birthday.")
        .trim()
        .custom((value, {req}) => {
            if(req.body.birth_date != '' && value != '' && value < req.body.birth_date) return false;
            return true;
        })
        .escape(),
    body('nature').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (req.body.date_received === '') req.body.date_received = Date.now();

        const pokemonInstance = new PokemonInstance({
            pokemon: req.body.pokemon,
            status: req.body.status,
            birth_date: req.body.birth_date,
            date_received: req.body.date_received,
            nature: req.body.nature
        });

        if(!errors.isEmpty()) {
            Pokemon.find({})
                .sort({name: 1})
                .exec((err, pokemonResult) => {
                    if(err) return err;
                    Nature.find({})
                        .sort({name: 1})
                        .exec((err, natureResult) => {
                            if(err) return err;

                            let statusIndex = statuses.map(status => status.value).indexOf(req.body.status);
                            for(let i = 0; i < statuses.length; i++) {
                                if(i === statusIndex) statuses[i].checked = true;
                                else statuses[i].checked = false;
                            }

                            res.render('pokemoninstance_form', {
                                title: 'Create pokemoninstance',
                                pokemon_list: pokemonResult,
                                nature_list: natureResult,
                                status_list: statuses,
                                pokemoninstance: pokemonInstance,
                                errors: errors.array()
                            });
                        });
                });
            return;
        }

        pokemonInstance.save((err) => {
            if(err) return err;
            res.redirect(pokemonInstance.url);
        });
    }
];

exports.pokemoninstance_delete_get = (req, res) => {
    PokemonInstance.findById(req.params.id)
        .exec((err, pokemoninstanceResult) => {
            if(err) return err;
            res.render('delete', {title: 'Delete Pokemon Instance', mainDeletion: pokemoninstanceResult})
        })
}

exports.pokemoninstance_delete_post = (req, res) => {
    PokemonInstance.findById(req.body.id)
        .exec((err, pokemonInstanceResult) => {
            if(err) return err;
            pokemonInstanceResult.remove();
            res.redirect('/catalog/pokemoninstance');
        })
}