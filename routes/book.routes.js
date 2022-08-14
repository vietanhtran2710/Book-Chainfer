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
            // Tạo thư mục với tên là id của phòng trọ để lưu ảnh của phòng trọ
            let savePath
            if (req.roomID) {
                // For creating new post
                savePath = path.join(__dirname, `./../../roomImages/${req.roomID}`)
            } else {
                // For saving new image to existing room
                savePath = path.join(__dirname, `./../../roomImages/${req.body.roomID}`)
            }

            if (!fs.existsSync(savePath)) {
                fs.mkdirSync(savePath, { recursive: true })
            }

            cb(null, savePath)
        },
        filename: function (req, file, cb) {
            // Add date to make sure that new file's name isn't duplicated
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // path.extname: add right file extension
        }
    })

    upload = multer({ storage, preservePath: true })
  
    // Create a new User
    router.post("/", authJwt.verifyToken, upload.any(), book.create);

    // Get all books
    router.get("/", book.getAll)
  
    app.use('/api/book', router);
  };