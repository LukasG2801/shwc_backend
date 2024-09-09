const express = require('express')
const router = express.Router()
const taskControllers = require('../../controllers/taskController')
const verifyToken = require('../../middleware/authMiddleware')

router.post('/create', taskControllers.create)
router.get('/tasks', verifyToken, taskControllers.getall)
router.post('/usertasks', verifyToken, taskControllers.getUserTasks)
router.post('/submittask', verifyToken, taskControllers.submitTask)
router.post('/resubmittask', verifyToken, taskControllers.reSubmitTask)
router.post('/checktask', verifyToken, taskControllers.checkTask)
router.post('/updatetask', verifyToken, taskControllers.updateTask)
router.post('/deletetask', verifyToken, taskControllers.deleteTask)
router.get('/taskstoreview', verifyToken, taskControllers.getTasksToReview)
router.get('/actualscore', verifyToken, taskControllers.getActualScore)

module.exports = router

