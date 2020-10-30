const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
      {
        id: 1,
        username: 'facebook-team',
        password: bcrypt.hash('password', 12),
      },
      {
        id: 2,
        username: 'google',
        password: bcrypt.hash('password', 12),
      },
      {
        id: 3,
        username: 'microsoft',
        password: bcrypt.hash('password', 12),
      },
      {
        id: 4,
        username: 'twitter',
        password: bcrypt.hash('password', 12),
      },
    ]
  }
  
  function makeMessagesArray(users) {
    return [
      {
        id: 1,
        chat_id: users[0].id,
        date: '2029-01-22T16:28:32.615Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        author: 'tzuyu'
    },
      {
        id: 2,
        chat_id: users[1].id,
        date: '2029-01-22T16:28:32.615Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        author: 'momo'
      },
      {
        id: 3,
        chat_id: users[2].id,
        date: '2029-01-22T16:28:32.615Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        author: 'rm'
      },
      {
        id: 4,
        chat_id: users[3].id,
        date: '2029-01-22T16:28:32.615Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        author: 'jin'
      },
    ]
  }
  
  
  function makeExpectedMessage(users, messages) {
    const chat = users
      .find(user => user.id === messages.chat_id)
  
    return {
      id: messages.id,
      content: messages.content,
      date: messages.date,
      author: messages.author,
      chat_id: chat
    }
  }
  
  function makeMaliciousMessage(user) {
    const maliciousMessage = {
      id: 911,
      date: new Date(),
      chat_id: user.id,
      content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    }
    const expectedMessage = {
      ...makeExpectedMessage([user], maliciousMessage),
      date: new Date(),
      content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
    }
    return {
      maliciousMessage,
      expectedMessage,
    }
  }
  
  function makeMessagesFixtures() {
    const testUsers = makeUsersArray()
    const testMessages = makeMessagesArray(testUsers)
    return { testUsers, testMessages }
  }
  
  function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          messages,
          users
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE messages_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('messages_id_seq', 0)`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
        ])
      )
    )
  }
  
  function seedMaliciousMessage(db, user, message) {
      return seedUsers(db, [user])
      .then(() =>
        db
          .into('messages')
          .insert([message])
      )
  }

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
         subject: user.username,
         algorithm: 'HS256',
       })
    return `Bearer ${token}`
  }
  
  module.exports = {
    makeUsersArray,
    makeMessagesArray,
    makeExpectedMessage,
    makeMaliciousMessage,
    makeMessagesFixtures,
    cleanTables,
    seedMaliciousMessage,
    makeAuthHeader,
  }