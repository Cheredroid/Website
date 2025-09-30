const router = require('express').Router();
const ctrl = require('../../controller/pokemonPC')


router.get('/', ctrl.getPC)



module.exports = router;