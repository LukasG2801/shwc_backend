const express = require('express')
const router = express.Router()
const teamControllers = require('../../controllers/teamController')

router.post('/create', teamControllers.create)
router.get('/teams', teamControllers.getall)
router.get('/teamswithplayers', teamControllers.getAllWithPlayers)
router.get('/openplayers', teamControllers.getAllUnassignedPlayers)
router.post('/assignplayertoteam', teamControllers.assignPlayerToTeam)
router.post('/removeplayerfromteam', teamControllers.removePlayerFromTeam)
router.post('/namefromid', teamControllers.nameFromId)
router.post('/getteammembers', teamControllers.getTeamMembers)
router.post('/getteamforuser', teamControllers.getTeamForUser)
router.post('/deleteteam', teamControllers.deleteTeam)
router.post('/changename', teamControllers.changeTeamName)

module.exports = router

