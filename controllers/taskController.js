const Task = require('../models/Task')
const Team = require('../models/Team')

async function getall(req, res) {

    try {
        const oTasks = await Task.find(); // Finde alle Tasks
        let tasks = [];
    
        // Verwende for...of, um auf asynchrone Operationen zu warten
        for (const task of oTasks) {
            console.log(task._id);
    
            let teamId = task.team;
            let team = await Team.findOne({ _id: teamId });
    
            tasks.push({
                _id: task._id,
                desc: task.desc,
                team: task.team,
                title: task.title,
                _v: task._v,
                teamname: team ? team.teamname : 'Team nicht gefunden', // Sicherheitshalber prüfen, ob das Team existiert
            });
        }
    
        console.log(tasks);
        return res.status(200).json(tasks); // Sende die gefüllte Aufgabenliste zurück
    
    } catch (ex) {
        return res.status(400).json({ 'message': ex.message }); // Fehlerhandling
    }
}

async function create(req, res) {
    const {title, desc} = req.body

    if(!title || !desc) return res.status(422).json({'message': 'Invalid fields'})

    try {

        await Task.create({
            title,
            desc
        })

        return res.sendStatus(201)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

module.exports = {create, getall}
