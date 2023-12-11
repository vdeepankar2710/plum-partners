const moment = require("moment")
const { Op, DATE } = require('sequelize')
const db = require("../models")
const { sequelize } = require('../models')
const { default: axios } = require("axios")
const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"
const UserInfo = db.user
const RepeatCount = db.repeatCount
const UserCoupon = db.userCoupon
const Coupon = db.coupon

const testAPI = async (req, res) => {
    try{
        res.status(200).json({status: "200", data: {message: "test API is running smooth"}})
    }catch(err){
        res.status(500).json({message:"internal server err"})
    }
    
}

// below API is for adding a coupon with its configurations (WeeklyUsageCount, DailyUsageCount etc)
const addCoupon = async (req, res)=>{
    try{
        if(!req.body.couponCode){
            res.status(400).json({message:"coupon code not provided", error:"invalid coupon"});
            return;
        }
        if(!req.body.expiry){
            res.status(400).json({message:"expiry date not provided"});
            return;
        }
        if(!req.body.userTotalCount){
            res.status(400).json({message:"user total count not provided"});
            return;
        }
        if(!req.body.userPerDayCount){
            res.status(400).json({message:"user per day count not provided"});
            return;
        }
        if(!req.body.userPerWeekCount){
            res.status(400).json({message:"user per week count not provided"});
            return;
        }
        if(!req.body.globalCount){
            res.status(400).json({message:"global count not provided"});
            return;
        }
        const couponCode = req.body.couponCode;
        const expiryDate = req.body.expiry;
        const generationDate = moment().format(DATE_TIME_FORMAT);
        const userTotalCount = req.body.userTotalCount;
        const userPerDayCount = req.body.userPerDayCount;
        const userPerWeekCount = req.body.userPerWeekCount;
        const globalCount = req.body.globalCount;

        if((typeof userPerDayCount !=='number') || 
        (typeof userPerWeekCount !=='number') || 
        (typeof userTotalCount !=='number') || 
        (typeof globalCount !=='number')  
        ){
            res.status(400).json({message:"Invalid count format. All counts must be integral"})
            return;
        }
        if((typeof couponCode!=='string')){
            res.status(400).json({message:"Invalid coupon code format. Code must be string"})
            return;
        }
        
        if(moment(generationDate).isAfter(expiryDate)){
            res.status(400).json({message:"Coupon generation date must be before expiry date!!"})
            return;
        }

        console.log("generationDate ,expiryDate",generationDate, expiryDate)


        const findCoupon = await Coupon.findOne({
            where:{
                couponCode:couponCode
            }
        })
        if(findCoupon){
            res.status(400).json({message:"This coupon already exists"});
            return;
        }
        const currentAddedCoupon = await Coupon.create({
            couponCode : couponCode,
            expiry : expiryDate,
            generationDate : generationDate,
            userTotalCount : userTotalCount,
            userPerDayCount : userPerDayCount,
            userPerWeekCount : userPerWeekCount,
            globalCount : globalCount
        });

        // console.log("currRepeatAddedCoupon", currRepeatAddedCoupon)
        res.status(201).json({message:"coupon created successfully!!!"});

    }catch(err){
        res.status(500).json({message:"Internal server error!!", error:err});
    }
}

//below API creates a user in user_info table
const createUser = async (req, res)=>{
    try{
        if(!req.body.firstName){
            res.status(400).json({message:"First name not provided"});
            return;
        }
        const firstName = req.body.firstName;
        const midName = req.body.midName || '';
        const lastName = req.body.lastName ||'';
        const createdUserInfo = await  UserInfo.create({firstName:firstName, midName:midName, lastName:lastName});
        
        res.status(201).json({status:201 ,message:"User created successfully!"});

    }catch(err){
        res.status(500).json({message:"Internal server err", error:err});
    }
}

// below API updates the coupon in Repeat table and creates a new entry in userCoupon table. 
const applyCoupon = async (req, res) => {
    try{
        if(!req.body.couponCode){
            res.status(400).json({message:"coupon code not provided", error:"invalid coupon"});
            return;
        }
        if(!req.body.userId){
            res.status(400).json({message:"userId not provided"});
            return;
        }
        if(!req.body.updateRepeatCountObjBool){
            res.status(400).json({message:"updateRepeatCountObjBool not provided"});
            return;
        }
        
        // console.log("req in applycoupon", req.body);
        const couponCode = req.body.couponCode;
        const userId = req.body.userId;
        const couponId = req.body.couponId;

        const updateRepeatCountObjBool = req.body.updateRepeatCountObjBool
        // make an entry in the userCoupon table corresponding to the user and coupon used.
        const useCoupon = await UserCoupon.create({userId:userId, coupon:couponId, usedDateTime:moment().format(DATE_TIME_FORMAT)});

        const currRepeat = await RepeatCount.findOne({
            where:
            {
                couponCode:couponCode,
                userId:userId
            }
        });

        if(!currRepeat){
            res.status(400).json({status:400, message:"No coupon found in repeat count"});
            return;
        }
        
        const updatedRepeatEntry = await RepeatCount.update({ 
            globalTotalRepeatCount: updateRepeatCountObjBool.global ? currRepeat.globalTotalRepeatCount+1 : currRepeat.globalTotalRepeatCount,
            userTotalRepeatCount: updateRepeatCountObjBool.userTotal ? currRepeat.userTotalRepeatCount+1 : currRepeat.userTotalRepeatCount,
        }, {
            where: {
                couponCode:couponCode,
                userId:userId
            },
        });

        console.log("updatedRepeatEntry", updatedRepeatEntry);

        res.status(200).json({message:"Coupon repeat count updated and new entry is created in userCoupon table"})
    }catch(err){
        res.status(500).json({message:"internal server error"});
    }
}

// below API verifies the coupon validity.
const verifyCouponValidity = async (req, res)=>{
    try{
        if(!req.body.couponCode){
            res.status(400).json({message:"coupon code not provided"});
            return;
        }
        if(!req.body.userId){
            res.status(400).json({message:"userId not provided"});
            return;
        }

        const couponCode = req.body.couponCode;
        const userId = req.body.userId;

        let updateRepeatCountObjBool = {
            "userTotal":1,
            "global":1,
        }

        const couponExists = await Coupon.findOne({
            where: { couponCode: couponCode }
        })

        if(!couponExists){
            res.status(400).json({message:"Requested coupon does not exists"})
            return;
        }

        const currDateTime = moment().utc().toDate();
        // console.log("couponExists",couponExists);
        const couponExpiryDate = couponExists.expiry;

        // console.log("currDateTime, couponExpiryDate", currDateTime ,couponExpiryDate)
        
        if(moment(currDateTime).isAfter(couponExpiryDate)){
            res.status(400).json({message:"Coupon has expired!!"})
            return;
        }

        let couponCurrRepeatHistory = await RepeatCount.findOne({
            where:
            {
                couponCode:couponCode,
                userId:userId
            }
        })

        if(!couponCurrRepeatHistory){
            // if the repeat history for that particular user and coupon does not exists, create one.
            couponCurrRepeatHistory = await RepeatCount.create({
                couponCode : couponCode,
                userId:userId,
                userTotalRepeatCount :0,
                globalTotalRepeatCount :0
            });
        }
        // console.log("couponCurrRepeatHistory", couponCurrRepeatHistory)

        if(couponCurrRepeatHistory.globalTotalRepeatCount+1 > couponExists.globalCount){
            updateRepeatCountObjBool.global = 0;
            res.status(400).json({message:"coupon global total repeat count exceeded"});
            return;
        }

        if(couponCurrRepeatHistory.userTotalRepeatCount+1 > couponExists.userTotalCount){
            updateRepeatCountObjBool.userTotal=0;
            res.status(400).json({message:"coupon for current user repeat count exceeded"});
            return;
        }
        
        const thisDayTime = moment(currDateTime).startOf('day').utc().toDate();
        console.log("thisDayTime, currDateTime", thisDayTime, currDateTime);
        const currUserPerDayCount = await UserCoupon.findAll({
            where: 
            {
                usedDateTime: {
                  [Op.gte]: thisDayTime,
                },
                coupon: couponExists.id,
                userId: userId,
            }
        })

        if(currUserPerDayCount.length+1 > couponExists.userDailyRepeatCount){
            updateRepeatCountObjBool.dailyCount = 0;
            res.status(400).json({status:400,message:"coupon for current user daily repeat count exceeded"});
            return;
        }
        const thisStartWeek = moment(currDateTime).startOf('week').utc().toDate();
        // console.log("thisStartWeek", thisStartWeek)
        const currUserPerWeekCount = await UserCoupon.findAll({
            where:{
                usedDateTime: {
                    [Op.gte]: thisStartWeek,
                },
                coupon: couponExists.id,
                userId: userId,
            }
        })

        if(currUserPerWeekCount.length+1 > couponExists.userWeeklyRepeatCount){
            updateRepeatCountObjBool.userWeekly = 0
            res.status(400).json({status:400, message:"coupon for current user weekly repeat count exceeded"});
            return;
        }
        // console.log("thisStartWeek", thisStartWeek)
        
        // if all the above constraints are false, then the coupon is valid and ready to be applied!!!!

        // API call for applyCoupon sending the userWeeklyRepeatCount
        const response = await axios.post('http://localhost:3000/applyCoupon', {
            couponCode:couponCode,
            couponId:couponExists.id,
            userId:userId,
            updateRepeatCountObjBool:{...updateRepeatCountObjBool}
        });
        console.log(response.data);
        res.status(200).json({ status:200, message: 'Another API executed successfully', data:response.data });

    }catch(err){
        res.status(500).json({message:"internal server error"});
    }
}

module.exports = {verifyCouponValidity, testAPI, createUser, addCoupon, applyCoupon}