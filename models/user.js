module.exports = (sequelize, Sequelize) => {    
    const UserInfo = sequelize.define("user_info", {
        firstName: {
            field:'first_name',
            type:Sequelize.TEXT,
            allowNull: false,
        },
        midName:{
            field:'mid_name',
            type:Sequelize.TEXT,
            allowNull:true,
        },
        lastName:{
            field:'last_name',
            type:Sequelize.TEXT,
            allowNull: true,
        },
    }, {
        freezeTableName: true,
        timestamps: false
    })
    return UserInfo;
}