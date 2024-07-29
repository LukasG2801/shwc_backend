const Task = require('../models/Task')

async function getall(req, res) {

    try {

        const tasks = await Task.find()
        console.log(tasks)
        return res.status(200).json(tasks)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
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
