const Task = require('../models/Task')
const Team = require('../models/Team')
const User = require('../models/User')

async function getall(req, res) {

    try {
        const oTasks = await Task.find(); // Finde alle Tasks
        let tasks = [];
    
        // Verwende for...of, um auf asynchrone Operationen zu warten
        for (const task of oTasks) {
            let teamId = task.team;
            let team = await Team.findOne({ _id: teamId });
    
            tasks.push({
                _id: task._id,
                desc: task.desc,
                team: task.team,
                title: task.title,
                _v: task._v,
                teamname: team ? team.teamname : 'Team nicht gefunden', // Sicherheitshalber prüfen, ob das Team existiert
                status: task.status
            });
        }
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
            desc,
            status: 'Offen'
        })

        return res.sendStatus(201)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function getUserTasks(req, res) {
    const userid = req.body.user.id

    try {
        let user = await User.findOne({ _id: userid })

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
 
    } catch (ex) {
        res.status(500).json({ message: 'An error occurred', error: ex });
    }
}

async function submitTask(req, res) {
    const taskid = req.body.task._id

    if(taskid) {
        try {
            let task = await Task.findOneAndUpdate({ _id: taskid}, { status: 'Eingereicht' })
            return res.status(200).json({task});
        }catch(ex) {
            return res.status(400).json({'message': ex.message})
        }
    }
}

async function reSubmitTask(req, res) {
    const taskid = req.body.task._id

    if(taskid) {
        try {
            let task = await Task.findOneAndUpdate({ _id: taskid}, { status: 'Offen' })
            return res.status(200).json({task});
        }catch(ex) {
            return res.status(400).json({'message': ex.message})
        }
    }
}

async function checkTask(req, res) {
    const taskid = req.body.task._id

    if(taskid) {
        try {
            let task = await Task.findOneAndUpdate({ _id: taskid}, { status: 'Abgeschlossen' })
            return res.status(200).json({task});
        }catch(ex) {
            return res.status(400).json({'message': ex.message})
        }
    }
}

async function getTasksToReview(req, res) {
    try {
        const oTasks = await Task.find({ status: 'Eingereicht' }); // Finde alle Tasks
        let tasks = [];
    
        // Verwende for...of, um auf asynchrone Operationen zu warten
        for (const task of oTasks) {
            let teamId = task.team;
            let team = await Team.findOne({ _id: teamId });
    
            tasks.push({
                _id: task._id,
                desc: task.desc,
                team: task.team,
                title: task.title,
                _v: task._v,
                teamname: team ? team.teamname : 'Team nicht gefunden', // Sicherheitshalber prüfen, ob das Team existiert
                status: task.status
            });
        }
        return res.status(200).json(tasks); // Sende die gefüllte Aufgabenliste zurück
    
    } catch (ex) {
        return res.status(400).json({ 'message': ex.message }); // Fehlerhandling
    }
}

async function updateTask(req, res) {
    try {
        const task = req.body.task

        const updatedTask = await Task.findByIdAndUpdate(task._id, { $set: task}, { new: true })
    
        if(!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
    
        return res.status(200).json(updatedTask);  // Erfolgreiche Aktualisierung, aktualisierte Aufgabe zurückgeben
    }catch(ex) {
        return res.status(500).json({ message: 'Error updating task', error });
    }

}

async function deleteTask(req, res) {
    try {
        await Task.findOneAndDelete({ _id: req.body.task._id })
        return res.status(200).json({message: 'Task deleted'});
    }catch(ex) {
        return res.status(500).json({ message: 'Error deleting task', error });
    }
}


async function getActualScore(req, res) {
    try {
        // 1. Alle Teams abrufen
        const teams = await Team.find();

        if (teams.length === 0) {
            return res.status(404).json({ message: 'No teams found' });
        }

        // 2. Ergebnis-Array für das Scoreboard und die maximale Anzahl abgeschlossener Aufgaben initialisieren
        let maxCompletedTasks = 0;

        // 3. Alle Teams und ihre Aufgaben laden
        const scoreboard = await Promise.all(teams.map(async (team) => {
            const tasks = await Task.find({ team: team._id });

            const completedTasksCount = tasks.filter(task => task.status === 'Abgeschlossen').length;

            // Maximalwert aktualisieren, wenn nötig
            if (completedTasksCount > maxCompletedTasks) {
                maxCompletedTasks = completedTasksCount;
            }

            return {
                teamId: team._id,
                teamName: team.teamname,
                totalTasks: tasks.length,
                completedTasks: completedTasksCount,
                tasks: tasks  // Optional: Falls du die Aufgaben im Response zurückgeben möchtest
            };
        }));

        // 4. Markiere alle Teams, die die maximale Anzahl abgeschlossener Aufgaben erreicht haben
        const scoreboardWithFlag = scoreboard.map(team => ({
            ...team,
            isLeading: team.completedTasks === maxCompletedTasks  // Führendes Team, falls es die meisten Aufgaben abgeschlossen hat
        }));

        // 5. Gesamtes Scoreboard zurückgeben
        return res.status(200).json(scoreboardWithFlag);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching scoreboard', error: error.message });
    }
}

async function changeTeamAssignment(req, res) {
    let taskid = req.body.taskid
    let teamid = req.body.teamid

    try {   
        await Task.findByIdAndUpdate(taskid, { team: teamid })
        return res.status(200).json({'message': 'Teamzuweisung geändert'})
    }catch(ex) {
        return res.status(400).json({'message': ex.message}) 
    }

}

module.exports = {changeTeamAssignment, create, getall, getUserTasks, submitTask, reSubmitTask, getTasksToReview, checkTask, updateTask, deleteTask, getActualScore}
