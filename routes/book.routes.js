const multer = require('multer')
const db = require('../models')
const path = require('path')
const authJwt = require('../middleware/authJwt')
const fs = require('fs')

module.exports = app => {
    const book = require("../controllers/book.controller.js");
  
    var router = require("express").Router();

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log("storage")
            console.log(req, file)
            // Tạo thư mục để lưu book
            let savePath
            savePath = path.join(__dirname, `./../bookFiles/`)

            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath, { recursive: true })
            }

            cb(null, savePath)
        },
        filename: function (req, file, cb) {
            // Add date to make sure that new file's name isn't duplicated
            cb(null, file.fieldname + '-' + req.body.id + '-' + Date.now() + path.extname(file.originalname)) // path.extname: add right file extension
        }
    })

    let test = async (req, res, next) => {
        console.log(req.body);
        next()
    }

    upload = multer({ storage, preservePath: true })
  
    // Create a new User
    router.post("/", authJwt.verifyToken, upload.any(), book.create);

    // Get all books
    // router.get("/", book.getAll)
  
    app.use('/api/book', router);
  };