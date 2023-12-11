
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app'); 

describe('createUser API', () => {
  it('should create a new user successfully', async () => {
    const response = await supertest(app)
      .post('/createUser')
      .send({
        firstName: 'Ram',
        midName: 'Doe',
        lastName: 'Gupta',
      });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal(201);
    expect(response.body.message).to.equal('User created successfully!');
  });

  it('should handle missing firstName', async () => {
    const response = await supertest(app)
      .post('/createUser')
      .send({
        // firstName:"",
        midName: 'Doe',
        lastName: 'Smith',
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('First name not provided');
  });

});
