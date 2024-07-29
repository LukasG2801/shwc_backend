const express = require('express')
const router = express.Router()
const gameControllers = require('../../controllers/gameController')

router.post('/create', gameControllers.create)
router.post('/start', gameControllers.startGame)
router.post('/stop', gameControllers.stopGame)
// router.post('/setstart', authControllers.register)
// router.post('/setend', authControllers.login)
router.get("/gamedata", gameControllers.getgamedata)

module.exports = router

