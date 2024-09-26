const Team = require('../models/Team')
const User = require('../models/User')
const Task = require('../models/Task')

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
}

async function getTeamMembers(req, res) {

    let userid = req.body.user.id

    try {
        let user = await User.findOne({ _id: userid })

        if(user.team) {
            let team = user.team

            let teammembers = await User.find({ team: team })
    
            return res.status(200).json(teammembers)
        } 

    }catch(ex) {

    }
}

async function getTeamForUser(req, res) {

    let userid = req.body.user.id

    try {
        let user = await User.findOne({ _id: userid })

        if(user.team) {
            let teamid = user.team
            
            let team = await Team.findOne({ _id: teamid })
            
            return res.status(200).json({ 'team': team.teamname })
        }else {
            return res.status(200).json({ 'team': 'Keinem Team zugewiesen' })
        }

    }catch(ex) {
        return res.status(400).json({'message': ex.message}) 
    }
}

async function deleteTeam(req, res) {
    try {
        let teamid = req.body.team.team._id;  // Die Team-ID extrahieren
        console.log("Teamid: " + teamid);

        if (teamid) {
            // 1. Alle Benutzer aktualisieren, die zu diesem Team gehören, indem das 'team'-Feld geleert wird
            await User.updateMany({ team: teamid }, { $unset: { team: "" } });
            await Task.updateMany({ team: teamid }, { $unset: { team: "" } });

            // 2. Das Team in der Datenbank löschen
            const deletedTeam = await Team.findOneAndDelete({ _id: teamid });

            if (!deletedTeam) {
                return res.status(404).json({ message: 'Team not found' });
            }

            return res.status(200).json({ message: 'Team deleted' });
        } else {
            return res.status(400).json({ message: 'Invalid team ID' });
        }
    } catch (ex) {
        console.error(ex);
        return res.status(500).json({ message: ex.message });
    }
}

async function changeTeamName(req, res) {
    console.log(req.body.teamid, req.body.newName)
    
    let teamid = req.body.teamid
    let newName = req.body.newName

    try {   
        await Team.findByIdAndUpdate(teamid, { teamname: newName })
        return res.status(200).json({'message': 'Team geändert'})
    }catch(ex) {
        return res.status(400).json({'message': ex.message}) 
    }
}


module.exports = {changeTeamName, create, getall, getAllUnassignedPlayers, assignPlayerToTeam, getAllWithPlayers, removePlayerFromTeam, nameFromId, getTeamMembers, getTeamForUser, deleteTeam}
