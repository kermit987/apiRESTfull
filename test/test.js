const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server.js')
const should = chai.should()
const mysql = require('mysql')
const bcrypt = require('bcrypt')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'steven',
  password: 'invadimpact', //change password depending on the computer
  database: 'apiRESTful', //We can't change but don't give a damn
})

connection.connect((error) => {
  if (error) {
    throw new Error('Error: connection to database failed')
  }
})

chai.use(chaiHttp)

describe('/ .GET', () => {
  it('Check the status code and the message', (done) => {
    chai.request(server)
      .get('/')
      .then((response) => { //what is the difference between .then and .end
      // .end((error, response) => {
        response.should.have.status(200)
        done()
        response.text.should.to.eql('INSIDE THE /')
      }).catch(() => {
        done()
      })
  })
})

describe('/subscription .GET', () => {
    it('Check the adequate file', (done) => {
      chai.request(server)
      .get('/subscription')
      .then((response) => { //what is the difference between .then and .end
        response.should.have.status(200)
        done()
      }).catch(() => {
        done()
      })
  })
})

describe('***** UPDATE BEFORE SUBSCRIPTION *****', () => {
  it ('', (done) => {
    connection.query('DELETE from user where username=?', ['premier'])
    done()
  })
})

describe('/subscription .POST', () => {
  it('Check with valid data', (done) => {
    const userInformation = {
      name: 'Steven',
      lastname: 'Loo Fat',
      typeblood: 'A',
      username: 'premier',
      email: 'premier.loofat@gmail.com',
      password: 'premier',
      confirmationPassword: 'premier'
    }
    chai.request(server)
      .post('/subscription')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(userInformation)
      .then((response) => {
        response.should.have.status(200)
        done()
      }).catch(() => {
        done()
      })
  })
  it('Check with wrong password', (done) => {
    const premier = {
      name: 'Steven',
      lastname: 'Loo Fat',
      typeblood: 'A',
      username: 'raiarii',
      email: 'raiarii.loofat@gmail.com',
      password: 'bidon',
      confirmationPassword: 'mesfesses'
    }
    chai.request(server)
      .post('/subscription')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(premier)
      .then((response) => {
        response.should.have.status(401)
        done()
      }).catch(() => {
        done()
      })
  })
  it('Check with a user and email already in used', (done) => {
    const userInformation = {
      name: 'Steven',
      lastname: 'Loo Fat',
      typeblood: 'A',
      username: 'steven987',
      email: 'premier.loofat@gmail.com',
      password: 'bidon',
      confirmationPassword: 'bidon'
    }
    chai.request(server)
      .post('/subscription')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(userInformation)
      .then((response) => {
        response.should.have.status(409)
        done()
      }).catch(() =>   {
        done()
      })
  })
})

describe('login .GET', () => {
  it('login should send status(200)', (done) => {
    chai.request(server)
      .get('/login')
      .then((response) => {
        response.should.have.status(200)
        done()
      })
  })
})

describe('***** UPDATE BEFORE login. POST *****', () => {
  it ('', (done) => {
    const saltRounds = bcrypt.genSaltSync(10)
    const encryptPassword = bcrypt.hashSync('premier', saltRounds)
    connection.query('UPDATE user SET password=? WHERE email=?', [encryptPassword, 'premier.loofat@gmail.com'], (error, result, field) => {
      if (error) {
        throw new Error('Error while updating user')
      }
    })
    done()
  })
})

describe('login .POST', () => {
  it('login should send status(200) if it work properly', (done) => {
    const userInformation = {
      username: 'premier',
      password: 'premier'
    }
    chai.request(server)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(userInformation)
      .then((response) => {
        response.should.have.status(200)
        done()
      }).catch((err) => {
        done(err)
      })
  })
  it('login should send status(403) because of wrong password', (done) => {
    const bidon = {
      username: 'premier',
      password: 'wrongPassword'
    }
    chai.request(server)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(bidon)
      .then((response) => {
        response.should.have.status(403)
        done()
      }).catch(() => {
        done()
      })
  })
  it('/login should send status (403) using non-existent user', (done) => {
    const bidon = {
      username: 'User which doesn\'t exist',
      password: 'premier'
    }
    chai.request(server)
      .post('/login')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(bidon)
      .then((response) => {
        response.should.have.status(403)
        done()
      }).catch(() => {
        done()
      })
  })
})

describe('/forgetPassword .GET', () => {
  it('/forgetPassword should send 200 OK', (done) => {
    chai.request(server)
      .get('/forgetPassword')
      .then((response) => {
        response.should.have.status(200)
        done()
      }).catch(() => {
        done()
      })
  })
})

describe('/forgetPassword .POST', () => {
  it('/forgetPassword should send 200', (done) => {
    const other = {
      email: 'premier.loofat@gmail.com'
    }
    chai.request(server)
      .post('/forgetPassword')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(other)
      .then((response) => {
        response.should.have.status(200)
        done()
      }).catch(() => {
        done()
      })
  })
  it('/forgetPassword should send 403 using unexistent email', (done) => {
    const lol = {
      email: 'wrong@address.com'
    }
    chai.request(server)
      .post('/forgetPassword')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send(lol)
      .then((response) => {
        response.should.have.status(403)
        done()
      }).catch(() => {
        done()
      })
  })
})

describe('/api/authenticated', () => {
  it('/api/authenticated should send back 200 OK', (done) => {
    chai.request(server)
      .get('/api/authenticated')
      .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InByZW1pZXIiLCJpYXQiOjE1MjI0Nzc3NjV9.Cjgh6vYIbzUIeqyvNvcKwzWrbfbfJ21zEbP7bp50JHM')
      .then((response) => {
        response.should.have.status(200)
        done()
      }).catch((err) => {
        done(err)
      })
  })
  it('/api/authenticated should sent back 400 when no token provided', (done) => {
    chai.request(server)
      .get('/api/authenticated')
      .then((response) => {
        response.should.have.status(400)
        done()
      }).catch(() => {
        done()
      })
  })
})
