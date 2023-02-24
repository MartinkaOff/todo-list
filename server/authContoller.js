const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt =  require('jsonwebtoken')
const {validationResult} = require('express-validator')
const {secret} = require('./config'); 

const generateAccessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class authContoller {
    async registration(req, res) {
        try {
            const errors = validationResult(req) 
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка", errors})
            }
            const {username, password} = req.body;
            const searchUser = await User.findOne({username})
            if (searchUser) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({username, password: hashPassword})
            await user.save()
            return res.json({message: "Пользователь успешно зарегистрирован"})
        } catch(error) {
            console.log(error)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `Пользователь ${username} не существует`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if(!validPassword) {
                return res.status(400).json({message: `Неверный пароль`})
            }
            const token = generateAccessToken(user._id)
            return res.json({token})
        } catch(error) {
            console.log(error)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch(error) {
            console.log(error)
        }
    }
}

module.exports = new authContoller;