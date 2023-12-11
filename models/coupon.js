module.exports = (sequelize, Sequelize) => { 
    const Coupon = sequelize.define("coupon", {
        couponCode:{
            field:'coupon_code',
            type:Sequelize.TEXT,
            allowNull:false,
            unique: true,
        },
        generationDate:{
            field:'generation_date',
            type:Sequelize.DATE,
            allowNull:false
        },
        expiry:{
            type:Sequelize.DATE,
            allowNull:false,
        },
        userTotalCount:{
            field:'user_total_count',
            type:Sequelize.INTEGER,
            allowNull:false
        },
        userPerDayCount:{
            field:'user_per_day_count',
            type:Sequelize.INTEGER,
            allowNull:false
        },
        userPerWeekCount:{
            field:'user_per_week_count',
            type:Sequelize.INTEGER,
            allowNull:false
        },
        globalCount:{
            field:'global_count',
            type:Sequelize.INTEGER,
            allowNull:false
        }
    }, {
        freezeTableName: true,
        timestamps: false
    })
    return Coupon;
}