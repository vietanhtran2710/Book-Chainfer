const authJwt = require('../middleware/authJwt')

module.exports = app => {
    const token = require("../controllers/token.controller.js");
  
    var router = require("express").Router();
  
    // Save and create a new selling token
    router.post("/", authJwt.verifyToken, token.create);

    //Buy token
    router.post("/buy", authJwt.verifyToken, token.buyToken);

    //Get all token currently selling
    router.get("/", authJwt.verifyToken, token.getAll);

    //Stop selling one token by id
    router.delete("/:id", authJwt.verifyToken, token.delete);
  
    app.use('/api/token', router);
  };