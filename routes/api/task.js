const express = require('express')
const router = express.Router()
const taskControllers = require('../../controllers/taskController')
const verifyToken = require('../../middleware/authMiddleware')

router.post('/create', taskControllers.create)
router.get('/tasks', verifyToken, taskControllers.getall)
router.post('/usertasks', verifyToken, taskControllers.getUserTasks)

module.exports = router

