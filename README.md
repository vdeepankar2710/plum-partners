# plum-partners
Take home assignment

# setting up the project
## I did this project on my windows laptop, so will state for the same.
1. Install Node and setup environment variables for Node.
2. Install PostgreSQL for database and setup the environment variables for the same.
3. Install git.

## Before starting the project, please make a database manually named coupon_code_db and drop any if already exists with the same name.

## Run `npm install` for all the dependecies to be installed in the application.
## Now, start the app using `node app.js` and the app will itself create all the database tables and models.

### Models: 
a. Coupon- For  storing information about the coupon, will have a unique coupon code, generationDate, expiry (each coupon will have an expiry date cannot be used beyond that) and count configurations columns.
b. User- for storing information of each user, must have a FirstName attribute, and will also have midName and lastName.
c. UserCoupon- For a mapping between User-Coupon table, will have ids of both the tables and will have usedDateTime. The usedDateTime entry ensures whenever a User has used a Coupon, an entry is created which will be helpful in determining Coupon usability in *Time* axis.
d. RepeatCoupon- for tracking the global usage of a Coupon and per User usage of a Coupon.
e. Index.js- has all the DB config and ensures exports of the models

## service has all the APIs, checks evenely whether the request is handling all the errors.
a. testAPI- Is just for testing that the server is ready or not.
b. addCoupon-  Is for adding new Coupon entry to the Coupon table.
c. createUser- Is for adding a User entry in the User Table.
d. verifyCouponValidity- Is the main API which takes care of verifying the coupon code whether it is eligible for application or not, checks for all the configurations of a coupon and only when all of them are under the constraints (coupon configurations and after exipry date), then only calls for applyCoupon API which updates the RepeatCount table and adds new entry in the UserCoupon table while ensuring all the error handling.

## Routes has routes which route the requests to the API services.

## config has configurations of DB and sequelize (ORM used).

## Unit test has all the unit tests for the app service.
