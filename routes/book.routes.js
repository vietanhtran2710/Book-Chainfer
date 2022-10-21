const authJwt = require('../middleware/authJwt')
const imageUpload = require('./fileUpload.js')

module.exports = app => {
    const book = require("../controllers/book.controller.js");
  
    var router = require("express").Router();
  
    // Save and create a new book
    router.post("/", authJwt.verifyToken, imageUpload.uploadFile().any('file'), book.create);

    //Get all books owned by an user
    router.get("/user/:address", authJwt.verifyToken, book.getUserBook);

    //Get a book file by id
    router.get("/download/:id", book.getBookFile);
  
    app.use('/api/book', router);
  };