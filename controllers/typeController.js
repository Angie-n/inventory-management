const Type = require('../models/type');
const Pokemon = require('../models/pokemon');

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