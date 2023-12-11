module.exports = (sequelize, Sequelize) => { 
    const RepeatCount = sequelize.define("repeat_count", {
        couponCode:{
            field:'coupon_code',
            type:Sequelize.TEXT,
            allowNull:false,
            references:{
                model:'coupon',
                key:'coupon_code'
            },
        },
        userId:{
            field:'user_id',
            type:Sequelize.INTEGER,
            references:{
                model:'user_info',
                key:'id'
            }
        },
        globalTotalRepeatCount:{
            field:'global_total_repeat_count',
            type:Sequelize.INTEGER,
            defaultValue: 0
        },
        userTotalRepeatCount:{
            field:'user_total_repeat_count',
            type:Sequelize.INTEGER,
            defaultValue: 0
        },
    }, {
        freezeTableName: true,
        timestamps: false
    })

    return RepeatCount;
}