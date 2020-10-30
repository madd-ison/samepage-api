const express = require('express')
const MessageService = require('./message-service')
const xss = require('xss')
const logger = require('../logger')
const { requireAuth } = require('../middleware/jwt-auth')


const messageRouter = express.Router()
const bodyParser = express.json()

const serializeMessage = message => ({
    id: message.id,
    chat_id: message.chat_id,
    date: message.date,
    content: xss(message.content),
    author: xss(message.author)
})

messageRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    MessageService.getAllMessages(knexInstance, req.user.id)
        .then(messages => res.json(messages.map(serializeMessage)))
        .catch(next)
  })
  .post(requireAuth, bodyParser, (req, res, next) => {
    for (const field of ['content']) {
        if (!req.body[field]) {
          logger.error(`${field} is missing`)
          return res.status(400).json({error: `${field} is missing`})
        }
      }
      const newMessage = {
        content: xss(req.body.content),
        author: xss(req.body.author),
      }
      newMessage.chat_id = req.user.id
      MessageService.addMessage(req.app.get('db'), newMessage)
        .then(message => {
            res
            .status(201)
            .location(`/api/messages/${message.id}`)
            .json(message)
        })
        .catch(next)
  })

messageRouter
.route('/:id')
.all(requireAuth)
.all((req, res, next) => {
  const {id} = req.params
  MessageService.getMessageById(req.app.get('db'), id)
    .then(message => {
      if (!message) {
        return res 
          .status(404)
          .json({error: {message: 'Message not found'}})
      }
      res.message = message
      next()
    })
    .catch(next)
})
.get((req, res, next) => {
  const message = res.message
  res.json(serializeMessage(message))
})
.delete((req, res, next) => {
  const {id} = req.params
  MessageService.deleteMessage(req.app.get('db'), id)
  .then(() => {
    res.status(204).end()
  })
  .catch(next)
})

module.exports = messageRouter