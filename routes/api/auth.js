const express = require('express')
const router = express.Router()
const authControllers = require('../../controllers/authController')

router.post('/register', authControllers.register)
router.post('/login', authControllers.login)
router.post('/logout', authControllers.logout)
router.post('/refresh', authControllers.refresh)
router.post('/deleteuser', authControllers.deleteUser)
router.post('/updateuser', authControllers.updateUser)
router.get('/user', authControllers.user)
router.get('/allusers', authControllers.getAllUsers)

module.exports = router

