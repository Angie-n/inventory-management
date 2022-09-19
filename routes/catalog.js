const express = require('express');
const router = express.Router();

const pokemon_controller = require('../controllers/pokemonController');
const type_controller = require('../controllers/typeController');

//pokemon controller stuff
router.get('/', pokemon_controller.index);

router.get('/pokemon', pokemon_controller.pokemon_list);

router.get('/pokemon/:id', pokemon_controller.pokemon_detail);

//Type controller stuff
router.get('/type', type_controller.type_list);

router.get('/type/:id', type_controller.type_detail);

module.exports = router;