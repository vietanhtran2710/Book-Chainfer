const db = require("../models");
const path = require('path')
const Book = db.books // chi phí đăng bài
const sequelize = db.sequelize
const { Op } = require('sequelize')

exports.create = async (req, res) => {
    console.log(req.body)
    try {
        const formData = req.body // các thông tin trong http body

        const bookFileLocalPath = path.join(__dirname, `./../bookFiles/${req.body.id}`) // directory to save room's images

        const book = {
            id: formData.id,
            authorName: formData.authorName,
            name: formData.name,
            fileURI: bookFileLocalPath
        }

        // Sau đó lưu thông tin bài đăng
        await Book.create(book)

        res.status(201).send({ message: 'Success' })
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err })
    }
}