const router = require('express').Router();
const ctrl = require('../../controller/users')

router.get('/', ctrl.getlogin)
router.post('/', ctrl.postLogin)
router.get('/signup', ctrl.getRegistry)
router.post('/signup',ctrl.postRegistry)

module.exports = router;