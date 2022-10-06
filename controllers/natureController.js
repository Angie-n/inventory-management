const { body, validationResult } = require("express-validator");
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
            if(natureResult == null) res.status(404).render('not_found');
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

exports.nature_create_get = (req, res, next) => {
    res.render('nature_form', {title: "Create Nature"})
};

exports.nature_create_post = [
    body("name", "Name must not be empty.")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body("increased_stat").trim().escape(),
    body("decreased_stat").trim().escape(),
    body("likes_flavor").trim().escape(),
    body("hates_flavor").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if(req.body.increased_stat === '') req.body.increased_stat = null
    if(req.body.decreased_stat === '') req.body.decreased_stat = null
    if(req.body.likes_flavor === '') req.body.likes_flavor = null
    if(req.body.hates_flavor === '') req.body.hates_flavor = null

    const nature = new Nature({
      name: req.body.name,
      increased_stat: req.body.increased_stat,
      decreased_stat: req.body.decreased_stat,
      likes_flavor: req.body.likes_flavor,
      hates_flavor: req.body.hates_flavor
    });

    if (!errors.isEmpty()) {
        res.render("nature_form", {
            title: "Create Nature",
            nature,
            errors: errors.array(),
          });
        return;
    }

    nature.save((err) => {
      if (err) return next(err);
      res.redirect(nature.url);
    });
  },
];

exports.nature_delete_get = (req, res) => {
  Nature.findById(req.params.id)
    .exec((err, natureResult) => {
      if(err) next(err);
      if(natureResult == null) res.redirect('/catalog/nature');
      PokemonInstance.find({nature: natureResult})
        .exec((err, pokemonInstanceResults) => {
          if(err) return err;
          res.render("delete", {
            title: "Delete Nature",
            mainDeletion: natureResult,
            otherDeletions: [{name: "Pokemon Instances", list: pokemonInstanceResults}],
            numDeletions: 1 + pokemonInstanceResults.length
          });
        });
    });
}

exports.nature_delete_post = (req, res, next) => {
  PokemonInstance.find({nature: req.body.id})
      .exec(async function (err, pokemonInstances) {
        if(err) return err;
        for(let i = 0; i < pokemonInstances.length; i++) await pokemonInstances[i].remove();
        Nature.findById(req.body.id)
        .exec(async function (err, natureResult) {
          if(err) next(err);
          await natureResult.remove();
          res.redirect("/catalog/nature");
        });
  });
}

exports.nature_update_get = (req, res, next) => {
  Nature.findById(req.params.id)
    .exec((err, natureResult) => {
      if(err) return err;
      res.render('nature_form', {title: "Update Nature", nature: natureResult})
    })
};

exports.nature_update_post = [
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("increased_stat").trim().escape(),
  body("decreased_stat").trim().escape(),
  body("likes_flavor").trim().escape(),
  body("hates_flavor").trim().escape(),
(req, res, next) => {
  const errors = validationResult(req);

  if(req.body.increased_stat === '') req.body.increased_stat = null
  if(req.body.decreased_stat === '') req.body.decreased_stat = null
  if(req.body.likes_flavor === '') req.body.likes_flavor = null
  if(req.body.hates_flavor === '') req.body.hates_flavor = null

  const nature = new Nature({
    _id: req.params.id,
    name: req.body.name,
    increased_stat: req.body.increased_stat,
    decreased_stat: req.body.decreased_stat,
    likes_flavor: req.body.likes_flavor,
    hates_flavor: req.body.hates_flavor
  });

  if (!errors.isEmpty()) {
      res.render("nature_form", {
          title: "Update Nature",
          nature,
          errors: errors.array(),
        });
      return;
  }

  Nature.findByIdAndUpdate(req.params.id, nature, (err) => {
    if(err) return err;
    res.redirect(nature.url);
  });
},
];