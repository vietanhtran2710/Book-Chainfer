const authJwt = require('../middleware/authJwt')
const blockchain = require('../middleware/blockchain')
const imageUpload = require('./fileUpload.js')

module.exports = app => {
    const book = require("../controllers/book.controller.js");
  
    var router = require("express").Router();
  
    // Save and create a new book
    router.post("/", authJwt.verifyToken, imageUpload.uploadFile().any('file'), book.create);

    //Get all books owned by an user
    router.get("/user/:address", authJwt.verifyToken, book.getUserBook);

    //Get one book info by id
    router.get("/single/:id", authJwt.verifyToken, book.getOneBook);

    //Get a book file by id
    router.get("/download/:id", authJwt.verifyToken, blockchain.verifyUserToken, book.getBookFile);
  
    app.use('/api/book', router);
  };