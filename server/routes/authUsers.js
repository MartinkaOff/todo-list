const Router = require('express');
const users = new Router();
const contoller = require('../authContoller');
const {check} = require("express-validator")

users.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 5 символов").isLength({min:5})
],  contoller.registration)
users.post('/login', contoller.login)
users.get('/users', contoller.getUsers)

module.exports = users;