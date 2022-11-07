module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define("book", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        tokenId: {
            type: DataTypes.INTEGER,
        },
        name: {
            allowNull: false,
            type: DataTypes.TEXT,
        },
        authorName: {
            type: DataTypes.STRING(50)
        },
        fileURI: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: "books",
        timestamps: true,
    })

    return Book;
};