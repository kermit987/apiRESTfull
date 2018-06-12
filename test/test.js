var assert = require('assert');
var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = chai.assert;
var should = chai.should();
var bcrypt = require('bcrypt');
var server = require('../server.js')

var userSchema = require('../model/userSchema.js')
var user = new userSchema()

chai.use(chaiHttp);

describe('/ .GET', () => {
  it('Check the status code and the message', (done) => {
    chai.request(server)
    .get('/')
    .then((response) => {
      response.should.have.status(200);
      done();
      response.text.should.to.eql('INSIDE THE /');
    }).catch((error) => {
      done();
    })
  })
})

describe('/subscription .GET', () => {
  it('Check the adequate file', (done) => {
    chai.request(server)
    .get('/subscription')
    .then((response) => {
      response.should.have.status(200);
      done();
    }).catch((error) => {
      done();
    })
  })
})

describe('***** UPDATE BEFORE SUBSCRIPTION *****', () => {
    it ('', (done) => {
    userSchema.remove({username: "premier"}, (err, result) => {
      if (err)
        console.log("Value of err ", err)
    })
    done();
  })
})

describe('/subscription .POST', () => {
  it('Check with valid data', (done) => {
    var userInformation = {
      name: "Steven",
      lastname: "Loo Fat",
      typeblood: "A",
      username: "premier",
      email: "premier.loofat@gmail.com",
      password: "premier",
      confirmationPassword: "premier"
    }
    chai.request(server)
    .post('/subscription')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(userInformation)
    .then((response) => {
      response.should.have.status(200);
      done();
    }).catch((error) => {
      done(error)
    })
  })
  it('Check with wrong password', (done) => {
    var premier = {
      name: "Steven",
      lastname: "Loo Fat",
      typeblood: "A",
      username: "raiarii",
      email: "raiarii.loofat@gmail.com",
      password: "bidon",
      confirmationPassword: "mesfesses"
    }
    chai.request(server)
    .post('/subscription')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(premier)
    .then((response) => {
      response.should.have.status(401);
      done();
    }).catch((error) => {
      done();
    })
  })
  it("Check with a user and email already in used", (done) => {
    var userInformation = {
      name: "Steven",
      lastname: "Loo Fat",
      typeblood: "A",
      username: "steven987",
      email: "premier.loofat@gmail.com",
      password: "bidon",
      confirmationPassword: "bidon"
    }
    chai.request(server)
    .post('/subscription')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(userInformation)
    .then((response) => {
      response.should.have.status(409);
      done();
    }).catch((error) =>   {
      done();
    })
  })
})

describe("login .GET", () => {
  it('login should send status(200)', (done) => {
    chai.request(server)
    .get('/login')
    .then((response) => {
      response.should.have.status(200);
      done();
    })
  })
})

describe('***** UPDATE BEFORE login. POST *****', () => {
    it ('', (done) => {
    var saltRounds = bcrypt.genSaltSync(10);
    var encryptPassword = bcrypt.hashSync("premier", saltRounds);
    userSchema.findOneAndUpdate({username: 'premier'}, {password: encryptPassword}, (err, doc) => {
      if (err)
        console.log("[ERROR] occur during update the password ", err)
      console.log("update password successfully ")
    })
    done();
  })
})

describe("login .POST", () => {
  it("login should send status(200) if it work properly", (done) => {
    var userInformation = {
      username: "premier",
      password: "premier"
    }
    chai.request(server)
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(userInformation)
    .then((response) => {
      response.should.have.status(200);
      done();
    }).catch((err) => {
      done(err);
    })
  })
  it("login should send status(403) because of wrong password", (done) => {
    var bidon = {
      username: "premier",
      password: "wrongPassword"
    }
    chai.request(server)
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(bidon)
    .then((response) => {
      response.should.have.status(403);
      done();
    }).catch((err) => {
      done()
    })
  })
  it("/login should send status (403) using non-existent user", (done) => {
    var bidon = {
      username: "User which doesn't exist",
      password: "premier"
    }
    chai.request(server)
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(bidon)
    .then((response) => {
      response.should.have.status(403);
      done()
    }).catch((err) => {
      done()
    })
  })
})

describe("/forgetPassword .GET", () => {
  it("/forgetPassword should send 200 OK", (done) => {
    chai.request(server)
    .get('/forgetPassword')
    .then((response) => {
      response.should.have.status(200);
      done();
    }).catch((error) => {
      done();
    })
  })
})

describe("/forgetPassword .POST", () => {
  it("/forgetPassword should send 200", (done) => {
    var other = {
      email: "premier.loofat@gmail.com"
    }
    chai.request(server)
    .post('/forgetPassword')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(other)
    .then((response) => {
      response.should.have.status(200);
      done();
    }).catch((error) => {
      done();
    })
  })
  it("/forgetPassword should send 403 using unexistent email", (done) => {
    var lol = {
      email: "wrong@address.com"
    }
    chai.request(server)
    .post('/forgetPassword')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(lol)
    .then((response) => {
      response.should.have.status(403);
      done();
    }).catch((error) => {
      done();
    })
  })
})
describe('/api/authenticated', () => {
  it("/api/authenticated should send back 200 OK", (done) => {
    chai.request(server)
    .get('/api/authenticated')
    .set('x-access-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InByZW1pZXIiLCJpYXQiOjE1Mjg4MDI4Mzd9.VJopnA1GNpuU8s33hhsvJV4O4uoG4Lpts2jCD8fph3E')
    .then((response) => {
      response.should.have.status(200)
      done();
    }).catch((err) => {
      done(err)
    })
  })
  it('/api/authenticated should sent back 400 when no token provided', (done) => {
    chai.request(server)
    .get('/api/authenticated')
    .then((response) => {
      response.should.have.status(400)
      done();
    }).catch((error) => {
      done();
    })
  })
})
