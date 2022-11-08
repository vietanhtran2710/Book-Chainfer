const db = require("../models");
const path = require('path')
const Book = db.books // book cost 
const sequelize = db.sequelize
const { Op } = require('sequelize');

exports.create = async (req, res) => {
    try {
        const formData = req.body
        const bookFileLocalPath = path.join(__dirname, `./../files/${req.files[0].filename}`) // directory to save book's pdf file
        const book = {
            id: formData.id,
            tokenId: formData.tokenId,
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

exports.getUserBook = async (req, res) => {
    const address = req.address;
    Book.findAll({ where: { userAddress: address } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving book with user address=" + address + ", " + err
            });
        });
}

exports.getBookFile = async (req, res) => {
    let id = req.params.id;
    const book = await Book.findByPk(id);
    if (book !== null) {
        res.download(book.fileURI); // Set disposition and send it.
    }
    else {
        res.status(404).send({ error: 'Book id not found' })
    }
}

exports.getOneBook = async (req, res) => {
    let id = req.params.id;
    Book.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving book with id=" + id + ", " + err
        });
    })
}