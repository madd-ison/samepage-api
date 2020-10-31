const {expect} = require('chai')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('../test/test-helpers')
const supertest = require('supertest')

describe('Messages endpoints', function() {
    let db
    let {testUsers, testMessages} = helpers.makeMessagesFixtures()

    function makeAuthHeader(user) {
       const token = Buffer.from(`${user.username}:${user.password}`).toString('base64')
       return `Basic ${token}`
     }

    before(() => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
      })

    before('cleanup', () => helpers.cleanTables(db))
    
    afterEach('cleanup', () => helpers.cleanTables(db))

    before(() => db('messages', 'users').truncate())
    
    after(() => db.destroy())

 describe(`Protected endpoints`, () => {
    beforeEach(() => {
        return db
            .into('users')
            .insert(testUsers)
      })

    beforeEach(() => {
        return db
            .into('messages')
            .insert(testMessages)
      })

      const protectedEndpoints = [
        {
          name: 'GET /api/messages', 
          path: '/api/messages'
        },
        {
          name: 'GET /api/messages/:id',
          path: '/api/messages/1'
        },
      ]
      protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
         it(`responds with 401 'Missing basic token' when no basic token`, () => {
           return supertest(app)
             .get(endpoint.path)
             .expect(401, { error: `Missing basic token` })
         })
         it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
           const userNoCreds = { username: '', password: '' }
           return supertest(app)
             .get(endpoint.path)
             .set('Authorization', makeAuthHeader(userNoCreds))
             .expect(401, { error: `Unauthorized request` })
         })
         it(`responds 401 'Unauthorized request' when invalid user`, () => {
            const userInvalidCreds = { username: 'user-not', password: 'existy' }
            return supertest(app)
              .get(endpoint.path)
              .set('Authorization', makeAuthHeader(userInvalidCreds))
              .expect(401, { error: `Unauthorized request` })
          })
         it(`responds 401 'Unauthorized request' when invalid password`, () => {
           const userInvalidPass = { username: testUsers[0].username, password: 'wrong' }
           return supertest(app)
             .get(endpoint.path)
             .set('Authorization', makeAuthHeader(userInvalidPass))
             .expect(401, { error: `Unauthorized request` })
         })
       })
     })
    })

    describe(`GET /api/messages`, () => {
        context(`Given no messages`, () => {
          beforeEach(() => {
            return db
                .into('users')
                .insert(testUsers)
          })
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/messages')
              .set('Authorization', makeAuthHeader(testUsers[0]))
              .expect(200, [])
          })
        })
    
        context('Given there are messages in the database', () => {
            beforeEach(() => {
                return db
                    .into('users')
                    .insert(testUsers)
              })
        
            beforeEach(() => {
                return db
                    .into('messages')
                    .insert(testMessages)
          })
          it('responds with 200 and all of the messages', () => {
            const expectedMessages = testMessages
            return supertest(app)
              .get('/api/messages')
              .set('Authorization', makeAuthHeader(testUsers[0]))
              .expect(200, expectedMessages)
          })
        })
    })
    describe(`POST /api/messages`, () => {
        beforeEach(() => {
            return db
                .into('users')
                .insert(testUsers)
          })
      it(`creates a new post, responding with 201 and new post`, function() {
        this.retries(3)
        const testMessage = testMessages[0]
        const testUser = testUsers[0]
        const newPost = {
            id: testMessage.id,
            content: 'content',
          }
        return supertest(app)
          .post('/api/messages')
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .send(newPost)
          .expect(201)
          .expect(res => {
            expect(res.body.content).to.eql(newPost.content)
            expect(res.body.id).to.eql(newPost.id)
            expect(res.body.user.id).to.eql(testUsers.id)
          })
          .expect(res => {
            db  
              .from('messages')
              .select('*')
              .where({id: res.body.id})
              .first()
              .then(row => {
                expect(row.content).to.eql(newPost.content)
                expect(row.chat_id).to.eql(testUser.id)
              })
          })
      })
    const requiredFields = ['content']

    requiredFields.forEach(field => {
      const testMessage = testMessages[0]
      const newPost = {
        content: 'Test new post',
        id: testMessage.id
        }
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newPost[field]
  
          return supertest(app)
            .post('/api/messages')
             .set('Authorization', makeAuthHeader(testUsers[0]))
            .send(newPost)
            .expect(400, {
              error: `${field} is missing`,
            })
        })
      })
    })
 })