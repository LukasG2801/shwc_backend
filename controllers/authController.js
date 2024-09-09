const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { getall } = require('./taskController')
const Team = require('../models/Team')

async function register(req, res) {
    
    const {username, email, password} = req.body
    let role = req.body.role

    // Check if all required fields are included in the request
    if(!username || !email || !password) return res.status(422).json({'message': 'Invalid fields'})

    const userExists = await User.exists({ email: email})

    // Check if the user already exists
    if(userExists) return res.status(409).json({'message': 'An User with that email already exists'})

    // if no specific role is given, then set the role to player as standard
    if(!role) {
        role = 'player'
    }

    // hash the given password and create the new user
    try {
        hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        return res.status(201).json({'message': 'User created'})
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function login(req, res) {
    const {email, password} = req.body

    if(!email || !password) return res.status(402).json({ 'message': 'Either email or password is not given'})

    // Find the user in the database from the given parameters
    const user = await User.findOne({email}).exec()

    // If no user was found, then return
    if(!user) return res.sendStatus(401).json({ 'message': "No user was found with the given Email" })
        
    let teamname = ''

    if(user.team) {
        let team = await Team.findOne({ _id: user.team})
        
        if(team) {
            teamname = team.teamname
        }
    }

    // Compare the hashed password in db with the given password from the request
    const match = await bcrypt.compare(password, user.password)

    // if the passwords dont match, return
    if(!match) return res.status(401).json({'message': 'Email or password is incorrect'})
    
    // create a token for the user
    const token = jwt.sign(
        {
            id: user.id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '1800s'
        }
    )

    // Return the logged in user
    res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        team: user.team,
        teamname: teamname,
        accessToken: token
    })
}

async function logout(req, res) {
    const cookies = req.cookies
    
    if(!cookies.refresh_token) return res.sendStatus(204)
        
    const refreshToken = cookies.refresh_token
    const user = await User.findOne({refresh_token: refreshToken}).exec()

    if(!user){
        res.clearCookie('refresh_token', {httpOnly: true})
        return res.sendStatus(204)
    }

    user.refresh_token = null
    await user.save()

    res.clearCookie('refresh_token', {httpOnly: true})
    res.sendStatus(204)
}

async function refresh(req, res) {
    const cookies = req.cookies

    if(!cookies.refresh_token) return res.sendStatus(401)

    const refreshToken = cookies.refresh_token

    const user = User.findOne({refresh_token: refreshToken}).exec()

    if(!user) return res.sendStatus(403)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || user.id !== decoded.id) return res.sendStatus(403)

            const accessToken = jwt.sign(
                { id: decoded.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1800s' }
            )

            res.json({access_token: accessToken})
        }
    )
}

async function user(req, res) {
    res.sendStatus(200)
}

async function getAllUsers(req, res) {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.body.id)
        return res.status(200)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

async function updateUser(req, res) {

    try {
        let user = await User.findOneAndUpdate(req.body.user)
        return res.status(200).json(user)
    }catch(ex) {
        return res.status(400).json({'message': ex.message})
    }
}

module.exports = {register, login, logout, refresh, user, getAllUsers, deleteUser, updateUser}