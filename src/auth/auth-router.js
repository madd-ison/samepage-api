const express = require('express')
const jsonBodyParser = express.json()
const authRouter = express.Router()
const AuthService = require('./auth-service')

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
     const { username, password } = req.body
     const loginUser = { username, password }

     for (const [key, value] of Object.entries(loginUser))
       if (value == null)
         return res.status(400).json({
           error: `Missing '${key}' in request body`
         })
         AuthService.getUserWithUserName(
           req.app.get('db'),
           loginUser.username
         )
           .then(dbUser => {
             if (!dbUser)
               return res.status(400).json({
                 error: 'Incorrect username or password',
               })

            return AuthService.comparePasswords(loginUser.password, dbUser.password)
                 .then(compareMatch => {
                   if (!compareMatch)
                     return res.status(400).json({
                       error: 'Incorrect username or password',
                     })
        
                    const sub = dbUser.username
                    const payload = { user_id: dbUser.id }
                   res.send({
                     authToken: AuthService.createJwt(sub, payload),
                   })
                 })
           })
           .catch(next)
  })

module.exports = authRouter