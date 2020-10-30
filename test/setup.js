const { expect } = require('chai')
const supertest = require('supertest')

process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'

global.expect = expect
global.supertest = supertest
require('dotenv').config()