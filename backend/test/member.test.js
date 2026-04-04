'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

const app = require('../server');
const User = require('../models/User');

chai.use(chaiHttp);
const expect = chai.expect;

// A fake member user passed through the auth middleware
const memberUser = { id: 'member001', name: 'John Doe', email: 'john@test.com', role: 'member' };

// Generate a real JWT so the protect middleware accepts it
const token = jwt.sign({ id: memberUser.id }, process.env.JWT_SECRET);

// Returns a Promise that also exposes .select() for middleware chaining
function findByIdResult(data) {
  const p = Promise.resolve(data);
  p.select = () => Promise.resolve(data);
  return p;
}

describe('Member Profile API', () => {
  afterEach(() => sinon.restore());

  // ── View Profile (Read) ──────────────────────────────────────────────────────

  it('TC11 - View Profile: should return member profile with status 200', async () => {
    // First findById = middleware, second = getProfile controller
    const findByIdStub = sinon.stub(User, 'findById');
    findByIdStub.onFirstCall().callsFake(() => findByIdResult(memberUser));
    findByIdStub.onSecondCall().resolves(memberUser);

    const res = await chai.request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.name).to.equal('John Doe');
    expect(res.body.email).to.equal('john@test.com');
  });

  it('TC12 - View Profile: should return 401 if no token provided', async () => {
    const res = await chai.request(app)
      .get('/api/auth/profile'); // no Authorization header

    expect(res).to.have.status(401);
  });

  // ── Update Profile (Update) ──────────────────────────────────────────────────

  it('TC13 - Update Profile: should update member name and return 200', async () => {
    const updatedUser = { id: 'member001', name: 'John Updated', email: 'john@test.com', role: 'member' };
    const userWithSave = {
      ...memberUser,
      save: sinon.stub().resolves(updatedUser),
    };

    // First findById = middleware, second = updateUserProfile controller
    const findByIdStub = sinon.stub(User, 'findById');
    findByIdStub.onFirstCall().callsFake(() => findByIdResult(memberUser));
    findByIdStub.onSecondCall().resolves(userWithSave);

    const res = await chai.request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John Updated', email: 'john@test.com' });

    expect(res).to.have.status(200);
    expect(res.body.name).to.equal('John Updated');
  });

  it('TC14 - Update Profile: should return 404 if member account not found', async () => {
    // First findById = middleware (passes), second = controller returns null (not found)
    const findByIdStub = sinon.stub(User, 'findById');
    findByIdStub.onFirstCall().callsFake(() => findByIdResult(memberUser));
    findByIdStub.onSecondCall().resolves(null);

    const res = await chai.request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John Updated', email: 'john@test.com' });

    expect(res).to.have.status(404);
    expect(res.body.message).to.equal('User not found');
  });
});
