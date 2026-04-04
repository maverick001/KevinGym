'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

const app = require('../server');
const User = require('../models/User');
const { createUser } = require('../controllers/adminController');

chai.use(chaiHttp);
const expect = chai.expect;

// A fake admin user passed through the auth middleware
const adminUser = { id: 'admin001', name: 'Admin', email: 'admin@gym.com', role: 'admin' };

// Generate a real JWT so the protect middleware accepts it
const token = jwt.sign({ id: adminUser.id }, process.env.JWT_SECRET);

// The protect middleware calls User.findById(id).select('-password').
// Some controllers also call User.findById(id) without .select().
// This helper returns a Promise that also exposes a .select() method,
// so it works in both cases.
function findByIdResult(data) {
  const p = Promise.resolve(data);
  p.select = () => Promise.resolve(data);
  return p;
}

describe('Admin User API', () => {
  afterEach(() => sinon.restore());

  // ── View Users ──────────────────────────────────────────────────────────────

  it('TC05 - Get Users: should return an array of users with status 200', async () => {
    sinon.stub(User, 'findById').callsFake(() => findByIdResult(adminUser));
    sinon.stub(User, 'find').returns({ select: sinon.stub().resolves([adminUser]) });

    const res = await chai.request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  // ── Create User ─────────────────────────────────────────────────────────────

  it('TC06 - Create User: should create a new user and return 201', async () => {
    sinon.stub(User, 'findById').callsFake(() => findByIdResult(adminUser));
    sinon.stub(User, 'findOne').resolves(null); // email not taken
    sinon.stub(User, 'create').resolves({
      id: 'u002', name: 'Jane Smith', email: 'jane@test.com', role: 'member',
    });

    const res = await chai.request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', role: 'member' });

    expect(res).to.have.status(201);
    expect(res.body.name).to.equal('Jane Smith');
    expect(res.body.email).to.equal('jane@test.com');
  });

  it('TC07 - Create User: should return 500 if a database error occurs', async () => {
    // Stub User.findOne to throw a DB error
    sinon.stub(User, 'findOne').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      body: { firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', role: 'member' },
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Call function directly (no HTTP layer needed)
    await createUser(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
  });

  // ── Update User ─────────────────────────────────────────────────────────────

  it('TC08 - Update User: should update user details and return 200', async () => {
    const targetUser = {
      id: 'u002', name: 'Old Name', email: 'jane@test.com', role: 'member',
      save: sinon.stub().resolves({ id: 'u002', name: 'New Name', email: 'jane@test.com', role: 'member' }),
    };

    // First findById call = middleware (needs .select), second = controller (direct await)
    const findByIdStub = sinon.stub(User, 'findById');
    findByIdStub.onFirstCall().callsFake(() => findByIdResult(adminUser));
    findByIdStub.onSecondCall().resolves(targetUser);

    const res = await chai.request(app)
      .put('/api/admin/users/u002')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name', email: 'jane@test.com', role: 'member' });

    expect(res).to.have.status(200);
    expect(res.body.name).to.equal('New Name');
  });

  // ── Delete User ─────────────────────────────────────────────────────────────

  it('TC09 - Delete User: should delete user and return success message', async () => {
    sinon.stub(User, 'findById').callsFake(() => findByIdResult(adminUser));
    sinon.stub(User, 'findByIdAndDelete').resolves({ id: 'u002' }); // user found and deleted

    const res = await chai.request(app)
      .delete('/api/admin/users/u002')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal('User deleted');
  });
});
