module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        address: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        nonce: {
            allowNull: false,
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: () => Math.floor(Math.random() * 1000000)
        },
        fullName: {
            type: DataTypes.STRING(50)
        },
        email: {
            type: DataTypes.STRING(50)
        }
    }, {
        tableName: "users",
        timestamps: true,
    })

    return User;
};