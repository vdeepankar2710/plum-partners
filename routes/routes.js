const couponService = require("../service/service")
var router = require("express").Router()


module.exports = app => {
    
    router.post("/testAPI", couponService.testAPI);
    router.post("/createUser", couponService.createUser);
    router.post("/addCoupon", couponService.addCoupon);
    router.post("/verifyCouponValidity", couponService.verifyCouponValidity);
    router.post("/applyCoupon", couponService.applyCoupon);
    
    app.use(router);

}