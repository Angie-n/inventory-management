const { body, validationResult } = require("express-validator");
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
            res.render('list', {title: 'Pokemon List', list: list_pokemon})
        })
}

exports.pokemon_detail = (req, res, next) => {
    Pokemon.findById(req.params.id)
        .populate('types')
        .exec((err, pokemonResult) => {
            if(err) return err;
            PokemonInstance.find({pokemon: pokemonResult})
                .sort({id: 1})
                .exec((err, pokemoninstancesResult) => {
                    if(err) return err;
                    res.render('pokemon_detail', {pokemon: pokemonResult, pokemoninstance_list: pokemoninstancesResult});
                });
        })
}

exports.pokemon_create_get = (req, res, next) => {
    Type.find({})
        .sort({name: 1})
        .exec((err, typeResult) => {
            if(err) return next(err);
            res.render('pokemon_form', {title: "Create Pokemon", types: typeResult});
        });
};

exports.pokemon_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.types)) {
      req.body.types =
        typeof req.body.types === "undefined" ? [] : [req.body.types];
    }
    if(req.body.image != null) body('image', "Image was given an invalid URL").isURL()
    next();
  },
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must must be 0 or greater and is limited to 2 decimal places.")
    .trim()
    .matches(/^\d+.{0,1}\d{0,2}$/)
    .escape(),
  body("image")
      .trim()
      .escape(),
  body("types", "Types should have 1-2 selected").isArray({min: 1, max: 2}),
  body("types.*").escape(),
  body("weight", "Weight must be an integer and 0 or greater")
    .trim()
    .isInt({min: 0})
    .escape(),
  body("height", "Height must be an integer and 0 or greater")
    .trim()
    .isInt({min: 0})
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const pokemon = new Pokemon({
      name: req.body.name,
      price: req.body.price,
      number_in_stock: 0,
      image: req.body.image,
      types: req.body.types,
      weight: req.body.weight,
      height: req.body.height,
    });

    if (!errors.isEmpty()) {
      Type.find({})
        .sort({name: 1})
        .exec((err, typeResult) => {
          if(err) return err;

          for (const type of typeResult) {
            if (pokemon.types.includes(type._id)) {
              type.checked = "true";
            }
          }
          res.render("pokemon_form", {
            title: "Create Pokemon",
            types: typeResult,
            pokemon,
            errors: errors.array(),
          });
        })
        return;
    }

    pokemon.save((err) => {
      if (err) return next(err);
      res.redirect(pokemon.url);
    });
  },
];

exports.pokemon_delete_get = (req, res) => {
  Pokemon.findById(req.params.id)
    .exec((err, pokemonResult) => {
      if(err) next(err);
      if(pokemonResult == null) res.redirect('/catalog/pokemon');
      PokemonInstance.find({pokemon: pokemonResult})
        .exec((err, pokemonInstanceResults) => {
          if(err) return err;
          res.render("delete", {
            title: "Delete Pokemon",
            mainDeletion: pokemonResult,
            otherDeletions: [{name: "Pokemon Instances", list: pokemonInstanceResults}],
            numDeletions: 1 + pokemonInstanceResults.length
          });
        });
    });
}

exports.pokemon_delete_post = (req, res, next) => {
  Promise.all([
    PokemonInstance.deleteMany({pokemon: req.body.id}),
    Pokemon.findById(req.body.id)
      .exec((err, pokemonResult) => {
        if(err) next(err);
        pokemonResult.remove();
      })
  ]).then(results => res.redirect("/catalog/pokemon"))
  .catch(err => next(err));
}