const express = require('express');
const router = express.Router();

const pokemon_controller = require('../controllers/pokemonController');

//pokemon controller stuff
router.get('/', pokemon_controller.index);

router.get('/pokemon', pokemon_controller.pokemon_list);

router.get('/pokemon/:id', pokemon_controller.pokemon_detail);

module.exports = router;