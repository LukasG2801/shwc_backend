const express = require('express')
const router = express.Router()
const taskControllers = require('../../controllers/taskController')

router.post('/create', taskControllers.create)
router.get('/tasks', taskControllers.getall)

module.exports = router

