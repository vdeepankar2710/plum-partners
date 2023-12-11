module.exports = (sequelize, Sequelize) => { 
    const UserCoupon = sequelize.define("user_coupon", {
        userId:{
            field:'user_id',
            type:Sequelize.INTEGER,
            references:{
                model:'user_info',
                key:'id'
            }
        },
        coupon:{
            type:Sequelize.INTEGER,
            references:{
                model:'coupon',
                key:'id'
            }
        },
        usedDateTime:{
            field:'used_date_time',
            type:Sequelize.DATE,
            allowNull:false,
        }
    }, {
        freezeTableName: true,
        timestamps: false
    })
    
    return UserCoupon;
}