const { body, validationResult } = require("express-validator");
const PokemonInstance = require('../models/pokemoninstance');
const Pokemon = require('../models/pokemon');
const Nature = require('../models/nature');

const dateFormatter = require('../public/javascripts/dateConverter');

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
function updateStatuses(checkedValue) {
    let statusIndex = statuses.map(status => status.value).indexOf(checkedValue);
    for(let i = 0; i < statuses.length; i++) {
        if(i === statusIndex) statuses[i].checked = true;
        else statuses[i].checked = false;
    }
}

exports.pokemonInstance_create_get = (req, res) => {
    Pokemon.find({})
        .sort({name: 1})
        .exec((err, pokemonResult) => {
            if(err) return err;
            Nature.find({})
                .sort({name: 1})
                .exec((err, natureResult) => {
                    if(err) return err;
                    res.render('pokemoninstance_form', {title:"Create Pokemon Instance", pokemon_list: pokemonResult, nature_list: natureResult, status_list: statuses, dateFormatter});
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
            else if(value == '' && Date.now() < new Date(req.body.birth_date)) return false;
            else return true;
        })
        .escape(),
    body('nature').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (req.body.date_received === '') req.body.date_received = Date.now();

        Pokemon.findById(req.body.pokemon)
            .exec((err, pokemonResult) => {
                if(err) return err;
                Nature.findById(req.body.nature)
                    .exec((err, natureResult) => {
                        if(err) return err;
                        const pokemonInstance = new PokemonInstance({
                            pokemon: pokemonResult,
                            status: req.body.status,
                            birth_date: req.body.birth_date,
                            date_received: req.body.date_received,
                            nature: natureResult
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
                
                                            updateStatuses(req.body.status);
                
                                            res.render('pokemoninstance_form', {
                                                title: 'Create Pokemon Instance',
                                                pokemon_list: pokemonResult,
                                                nature_list: natureResult,
                                                status_list: statuses,
                                                pokemoninstance: pokemonInstance,
                                                dateFormatter,
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
                    })
            })
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
exports.pokemoninstance_update_get = (req, res) => {
    PokemonInstance.findById(req.params.id)
        .populate('pokemon')
        .populate('nature')
        .exec((err, pokemonInstanceResult) => {
            if(err) return err;
            updateStatuses(pokemonInstanceResult.status);
            Pokemon.find()
                .sort({name: 1})
                .exec((err, pokemonResults) => {
                    if(err) return err;
                    Nature.find()
                        .sort({name: 1})
                        .exec((err, natureResults) => {
                            if(err) return err;
                            res.render('pokemoninstance_form', {title:"Update Pokemon Instance", pokemoninstance: pokemonInstanceResult,  pokemon_list: pokemonResults, nature_list: natureResults, status_list: statuses, dateFormatter});
                        })
                })
        })
}

exports.pokemoninstance_update_post = [
    body('pokemon').trim().escape(),
    body('status').trim().escape(),
    body('birth_date')
        .trim()
        .escape(),
    body('date_received', "Date received can't be earlier than the pokemon's birthday.")
        .trim()
        .custom((value, {req}) => {
            if(req.body.birth_date != '' && value != '' && value < req.body.birth_date) return false;
            else if(value == '' && Date.now() < new Date(req.body.birth_date)) return false;
            else return true;
        })
        .escape(),
    body('nature').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);

        if (req.body.date_received === '') req.body.date_received = Date.now();
        if (req.body.birth_date === '') req.body.birth_date = null;

        Pokemon.findById(req.body.pokemon)
            .exec((err, pokemonResult) => {
                if(err) return err;
                Nature.findById(req.body.nature)
                    .exec((err, natureResult) => {
                        if(err) return err;
                        const pokemonInstance = new PokemonInstance({
                            _id: req.params.id,
                            pokemon: pokemonResult,
                            status: req.body.status,
                            birth_date: req.body.birth_date,
                            date_received: req.body.date_received,
                            nature: natureResult
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
                
                                            updateStatuses(req.body.status);
                
                                            res.render('pokemoninstance_form', {
                                                title: 'Update Pokemon Instance',
                                                pokemon_list: pokemonResult,
                                                nature_list: natureResult,
                                                status_list: statuses,
                                                pokemoninstance: pokemonInstance,
                                                dateFormatter,
                                                errors: errors.array()
                                            });
                                        });
                                });
                            return;
                        }
                
                        PokemonInstance.findById(req.params.id, (err, pokemonInstanceResult) => {
                            if(err) next(err);
                            PokemonInstance.updateOne(pokemonInstanceResult, pokemonInstance, {new: true}, err => {
                                if(err) return err;
                                res.redirect(pokemonInstanceResult.url);
                            })
                        });
                    });
            });
    }
];