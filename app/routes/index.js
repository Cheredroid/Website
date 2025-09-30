const router = require('express').Router()
const trainerRouter = require('./trainers');
const pokemonPCRouter = require('./PokemonPC.js')
const { guard } = require('../controller/users.js')


router.use('/', trainerRouter)
router.use('/pc', guard, pokemonPCRouter)

module.exports = router;