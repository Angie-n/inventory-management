const express = require('express');
const router = express.Router();

const pokemon_controller = require('../controllers/pokemonController');
const type_controller = require('../controllers/typeController');
const pokemoninstance_controller = require('../controllers/pokemoninstanceController');

//pokemon controller stuff
router.get('/', pokemon_controller.index);
router.get('/pokemon', pokemon_controller.pokemon_list);
router.get('/pokemon/:id', pokemon_controller.pokemon_detail);

//type controller stuff
router.get('/type', type_controller.type_list);
router.get('/type/:id', type_controller.type_detail);

//pokemoninstance controller stuff
router.get('/pokemoninstance', pokemoninstance_controller.pokemonInstance_list);
router.get('/pokemoninstance/:id', pokemoninstance_controller.pokemonInstance_detail);

module.exports = router;