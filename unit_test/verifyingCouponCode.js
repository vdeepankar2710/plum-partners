
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app'); 

describe('verifyUser API', () => {
  it('should verify for coupon code', async () => {
    const response = await supertest(app)
      .post('/verifyCouponValidity')
      .send({
        // couponCode:'',
        userId:1
      });

    expect(response.status).to.equal(400);
    // expect(response.body.status).to.equal(201);
    expect(response.body.message).to.equal('coupon code not provided');
  });


  
});
