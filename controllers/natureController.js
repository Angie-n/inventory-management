const Nature = require('../models/nature');
const PokemonInstance = require('../models/pokemoninstance');

exports.nature_list = (req, res, next) => {
    Nature.find({}, 'name')
        .sort({name: 1})
        .exec((err, list_nature) => {
            if(err) return err;
            res.render('list', {title: 'Nature List', list: list_nature})
        })
}

exports.nature_detail = (req, res, next) => {
    Nature.findById(req.params.id)
        .exec((err, natureResult) => {
            if(err) return err;
            PokemonInstance.find({nature: natureResult})
            .sort({id: 1})
            .populate('pokemon')
            .exec((err, pokemoninstanceResult) => {
                if(err) return err;
                res.render('nature_detail', {nature: natureResult, pokemoninstance_list: pokemoninstanceResult});
            });
        });
}