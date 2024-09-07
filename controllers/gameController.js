const Game = require('../models/Game')
const Task = require('../models/Task')
const Team = require('../models/Team')

async function create(req, res) {
    const {state} = req.body

    if(!state) return res.status(422).json({'message': 'Invalid state'})

    try {

        await Game.create({
            state
        })

        return res.sendStatus(201)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function getgamedata(req, res) {
    try {
        const game = await Game.findOne()

        return res.status(200).json(game)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function startGame(req, res) {
    try {

        // Aufgaben verteilen
        const tasks = await Task.find()
        const teams = await Team.find()

        tasks.sort(() => Math.random() - 0.5)

        for(let i = 0; i < tasks.length; i++) {
            const teamIndex = i % teams.length
            tasks[i].team = teams[teamIndex]._id
            await tasks[i].save()
        }

        const game = await Game.findOneAndUpdate({}, { state: 'Gestartet' })

        return res.status(200).json({'message': 'Spiel gestaret'})
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function stopGame(req, res) {
    try {
        const game = await Game.findOneAndUpdate({}, { state: 'Gestoppt' })

        return res.status(200).json({'message': 'Spiel gestoppt'})
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function setAutomaticDistribution(req, res) {
    console.log(req.body.automaticdistribution)
    try {
        const game = await Game.findOneAndUpdate({}, {automatictaskdistribution: req.body.automaticdistribution})
        return res.status(200).json({'message': 'Einstellungen gespeichert'})
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
    
}

module.exports = {create, getgamedata, startGame, stopGame, setAutomaticDistribution}
