const express = require('express');
const router = express.Router();

const pokemon_controller = require('../controllers/pokemonController');
const type_controller = require('../controllers/typeController');
const pokemoninstance_controller = require('../controllers/pokemoninstanceController');
const nature_controller = require('../controllers/natureController');

//pokemon controller stuff
router.get('/', pokemon_controller.index);
router.get('/pokemon', pokemon_controller.pokemon_list);
router.get('/pokemon/create', pokemon_controller.pokemon_create_get);
router.post('/pokemon/create', pokemon_controller.pokemon_create_post);
router.get('/pokemon/:id/delete', pokemon_controller.pokemon_delete_get);
router.post('/pokemon/:id/delete', pokemon_controller.pokemon_delete_post);
router.get('/pokemon/:id', pokemon_controller.pokemon_detail);

//type controller stuff
router.get('/type', type_controller.type_list);
router.get('/type/create', type_controller.type_create_get);
router.post('/type/create', type_controller.type_create_post);
router.get('/type/:id/delete', type_controller.type_delete_get);
router.post('/type/:id/delete', type_controller.type_delete_post);
router.get('/type/:id', type_controller.type_detail);

//pokemoninstance controller stuff
router.get('/pokemoninstance', pokemoninstance_controller.pokemonInstance_list);
router.get('/pokemoninstance/create', pokemoninstance_controller.pokemonInstance_create_get);
router.post('/pokemoninstance/create', pokemoninstance_controller.pokemonInstance_create_post);
router.get('/pokemoninstance/:id/delete', pokemoninstance_controller.pokemoninstance_delete_get);
router.post('/pokemoninstance/:id/delete', pokemoninstance_controller.pokemoninstance_delete_post);
router.get('/pokemoninstance/:id', pokemoninstance_controller.pokemonInstance_detail);

//nature controller stuff
router.get('/nature', nature_controller.nature_list);
router.get('/nature/create', nature_controller.nature_create_get);
router.post('/nature/create', nature_controller.nature_create_post);
router.get('/nature/:id/delete', nature_controller.nature_delete_get);
router.post('/nature/:id/delete', nature_controller.nature_delete_post);
router.get('/nature/:id', nature_controller.nature_detail);

module.exports = router;