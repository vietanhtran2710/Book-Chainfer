module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define("token", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
    }, {
        tableName: "tokens",
        timestamps: true,
    })

    return Token;
};