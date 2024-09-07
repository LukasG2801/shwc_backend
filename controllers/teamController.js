const Team = require('../models/Team')
const User = require('../models/User')

async function getall(req, res) {

    try {

        const teams = await Team.find()
        console.log(teams)
        return res.status(200).json(teams)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function getAllWithPlayers(req, res) {
    try {
        const teams = await Team.find()
        let teamsWithPlayers = []

        for(const team of teams) {
            let newTeam = {}
            let teamId = team._id
            let users = await User.find( { team: teamId } )
            newTeam.players = users
            newTeam.team = team
            console.log(newTeam.players)
            teamsWithPlayers.push(newTeam)
        }

        console.log(teamsWithPlayers)
        return res.status(200).json(teamsWithPlayers)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function create(req, res) {
    const {teamname} = req.body

    if(!teamname) return res.status(422).json({'message': 'Invalid teamname'})

    try {

        await Team.create({
            teamname
        })

        return res.sendStatus(201)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function getAllUnassignedPlayers(req, res) {
    try {
        const users = await User.find()
        const unassignedUsers = []
        console.log(users)
        users.forEach(user => {
            if(!user.team || user.team == "") {
                unassignedUsers.push(user)
            }
        })

        return res.status(200).json(unassignedUsers)
    }catch(ex) {
        return res.status(400).json({'message': ex.message}) 
    }
}

async function assignPlayerToTeam(req, res) {
    console.log("assignPlayerToTeam")

    let teamId = req.body.team
    let playerId = req.body.user
    console.log(teamId, playerId)
    try {   
        await User.findByIdAndUpdate(playerId, { team: teamId })
        return res.sendStatus(200)
    }catch(ex) {
        return res.status(400).json({'message': ex.message}) 
    }

}

async function removePlayerFromTeam(req, res) {
    let playerId = req.body.player._id

    console.log(playerId)

    try {   
        await User.findByIdAndUpdate(playerId, { $unset: { team: "" }})
        return res.sendStatus(200)
    }catch(ex) {
        return res.status(400).json({'message': ex.message}) 
    }
}

async function nameFromId(req, res) {
    let id = req.body.id
    console.log(id)
    let team = await Team.findOne( { _id: id })

    console.log(team)
}

module.exports = {create, getall, getAllUnassignedPlayers, assignPlayerToTeam, getAllWithPlayers, removePlayerFromTeam, nameFromId}
