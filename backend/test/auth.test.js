'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const bcrypt = require('bcrypt');

// Must be set before requiring app so JWT signing works
process.env.JWT_SECRET = 'test_secret';

const app = require('../server');
const User = require('../models/User');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication Panel API', () => {
  // Restore all stubs after each test so they don't bleed into the next one
  afterEach(() => sinon.restore());

  // ── Register ────────────────────────────────────────────────────────────────

  it('TC01 - Register: should create a new user and return 201', async () => {
    sinon.stub(User, 'findOne').resolves(null); // no existing user
    sinon.stub(User, 'create').resolves({
      id: 'u001', name: 'John Doe', email: 'john@test.com', role: 'member',
    });

    const res = await chai.request(app)
      .post('/api/auth/register')
      .send({ name: 'John Doe', email: 'john@test.com', password: 'Pass123' });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('token');
    expect(res.body.email).to.equal('john@test.com');
  });

  it('TC02 - Register: should return 400 if email already registered', async () => {
    sinon.stub(User, 'findOne').resolves({ email: 'john@test.com' }); // user exists

    const res = await chai.request(app)
      .post('/api/auth/register')
      .send({ name: 'John Doe', email: 'john@test.com', password: 'Pass123' });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal('User already exists');
  });

  // ── Login ───────────────────────────────────────────────────────────────────

  it('TC03 - Login: should return a token on valid credentials', async () => {
    sinon.stub(User, 'findOne').resolves({
      id: 'u001', name: 'John Doe', email: 'john@test.com', role: 'member', password: 'hashed',
    });
    sinon.stub(bcrypt, 'compare').resolves(true); // password matches

    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'john@test.com', password: 'Pass123' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('token');
    expect(res.body.email).to.equal('john@test.com');
  });

  it('TC04 - Login: should return 401 on wrong password', async () => {
    sinon.stub(User, 'findOne').resolves({
      id: 'u001', email: 'john@test.com', password: 'hashed',
    });
    sinon.stub(bcrypt, 'compare').resolves(false); // password does not match

    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'john@test.com', password: 'wrongpassword' });

    expect(res).to.have.status(401);
    expect(res.body.message).to.equal('Invalid email or password');
  });
});
