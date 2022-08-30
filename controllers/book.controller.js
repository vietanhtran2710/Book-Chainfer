const db = require("../models");
const path = require('path')
const Book = db.books // chi phí đăng bài
const sequelize = db.sequelize
const { Op } = require('sequelize')

exports.create = async (req, res) => {
    try {
        const formData = req.body
        const bookFileLocalPath = path.join(__dirname, `./../files/${req.files[0].filename}`) // directory to save book's file
        const book = {
            id: formData.id,
            authorName: formData.author,
            name: formData.name,
            fileURI: bookFileLocalPath,
            userAddress: req.address
        }
        await Book.create(book)
        res.status(201).send({ message: 'Success' })
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err })
    }
}