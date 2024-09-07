const Task = require('../models/Task')
const Team = require('../models/Team')
const User = require('../models/User')

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

async function getUserTasks(req, res) {
    const userid = req.body.user._id

    try {
        let user = await User.findOne({ userid })

        if(user) {
            let team = user.team
    
            if(team) {
                let tasks = await Task.find({ team: team})
        
                return res.status(200).json(tasks);
            }else {
                return res.status(400).json({'message': 'Du bist noch keinem Team zugewiesen'})
            }
        }else {
            return res.status(400).json({'message': 'User nicht gefunden'})
        }
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }

}

async function checkUncheckTask(req, res) {
    const taskid = req.body.task._id;

    try {
        if(taskid) {
            // Finde die aktuelle Task
            const task = await Task.findById(taskid);

            // Überprüfen, ob die 'checked'-Property existiert; falls nicht, als 'false' behandeln
            const currentCheckedValue = task.checked !== undefined ? task.checked : false;

            // Umdrehen des 'checked' Werts
            const newCheckedValue = !currentCheckedValue;

            // Führe das Update durch und füge die 'checked'-Property hinzu, wenn sie nicht existiert
            await Task.findOneAndUpdate({ _id: taskid }, { checked: newCheckedValue });

            // Rückgabe einer Bestätigung oder der aktualisierten Aufgabe
            res.status(200).json({ message: 'Task updated', checked: newCheckedValue });
        } else {
            res.status(400).json({ message: 'Task ID is missing' });
        }
    } catch (ex) {
        res.status(500).json({ message: 'An error occurred', error: ex });
    }
}

module.exports = {create, getall, getUserTasks}
