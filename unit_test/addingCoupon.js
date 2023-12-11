
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app'); 
const moment = require('moment');
const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"

describe('addCoupon API', () => {
  it('should create a new coupon successfully', async () => {
    const response = await supertest(app)
      .post('/addCoupon')
      .send({
        couponCode: 'TEST123',
        expiry: moment().add(1, 'days').format(DATE_TIME_FORMAT),
        userTotalCount: 10,
        userPerDayCount: 2,
        userPerWeekCount: 5,
        globalCount: 20,
      });

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('coupon created successfully!!!');
  });

  it('should handle missing couponCode', async () => {
    const response = await supertest(app)
      .post('/addCoupon')
      .send({
        // Omitting couponCode intentionally
        expiry: moment().add(1, 'days').format(DATE_TIME_FORMAT),
        userTotalCount: 10,
        userPerDayCount: 2,
        userPerWeekCount: 5,
        globalCount: 20,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('coupon code not provided');
  });
  it('should handle missing expiry date', async () => {
    const response = await supertest(app)
      .post('/addCoupon')
      .send({
        couponCode: 'TEST123',
        // expiry: moment().add(1, 'days').toISOString(),
        userTotalCount: 10,
        userPerDayCount: 2,
        userPerWeekCount: 5,
        globalCount: 20,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('expiry date not provided');
  });

  it('should handle missing userTotalCount', async () => {
    const response = await supertest(app)
      .post('/addCoupon')
      .send({
        couponCode: 'TEST123',
        expiry: moment().add(1, 'days').format(DATE_TIME_FORMAT),
        // userTotalCount: 10,
        userPerDayCount: 2,
        userPerWeekCount: 5,
        globalCount: 20,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('user total count not provided');
  });
  it('should handle missing userTotalCount to be other that number', async () => {
    const response = await supertest(app)
      .post('/addCoupon')
      .send({
        couponCode: 'TEST123',
        expiry: moment().add(1, 'days').format(DATE_TIME_FORMAT),
        userTotalCount: "10",       //string
        userPerDayCount: 2,
        userPerWeekCount: 5,
        globalCount: 20,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Invalid count format. All counts must be integral');
  });

  it('should handle missing coupon code to be other that string', async () => {
    const response = await supertest(app)
      .post('/addCoupon')
      .send({
        couponCode: 123,
        expiry: moment().add(1, 'days').format(DATE_TIME_FORMAT),
        userTotalCount: 10,       
        userPerDayCount: 2,
        userPerWeekCount: 5,
        globalCount: 20,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Invalid coupon code format. Code must be string');
  });
  it('should handle expiry date is after generation date(current date)', async () => {
    const response = await supertest(app)
      .post('/addCoupon')
      .send({
        couponCode: "123",
        expiry: moment().subtract(1, 'days').format(DATE_TIME_FORMAT),
        userTotalCount: 10,       
        userPerDayCount: 2,
        userPerWeekCount: 5,
        globalCount: 20,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Coupon generation date must be before expiry date!!');
  });

//   it('should handle if coupon already exists', async () => {
//     // enter a coupon with same code as below
//     const response = await supertest(app)
//       .post('/addCoupon')
//       .send({
//         couponCode: 123,
//         expiry: moment().subtract(1, 'days').toISOString(),
//         userTotalCount: 10,       
//         userPerDayCount: 2,
//         userPerWeekCount: 5,
//         globalCount: 20,
//       });

//     expect(response.status).to.equal(400);
//     expect(response.body.message).to.equal('This coupon already exists');
//   });


});
