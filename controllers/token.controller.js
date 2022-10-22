const db = require("../models");
const Token = db.tokens;
const sequelize = db.sequelize
const { QueryTypes, Op } = require('sequelize');

// Create a new User
exports.create = async (req, res) => {
	const tokenData = req.body;
    console.log(tokenData);
	if (tokenData.tokenId === undefined || !tokenData.bookId === undefined) {
		res.status(400).send({
			message: "A required field is missing!"
		});
		return;
	}
    let findToken = await Token.findByPk(tokenData.tokenId);
    console.log(findToken);
    if (findToken === null) {
        try {
            const token = {
                id: tokenData.tokenId,
                bookId: tokenData.bookId,
            }
            await Token.create(token)
            res.status(201).send({ message: 'Create selling token successfully' })
        } catch (err) {
            res.status(500).send({
                error: err.message || "Some error occurred while creating the token."
            });
        }
    }
    else {
        res.send({message: "Done"})
    }
}

// Retrieve all selling tokens
exports.getAll = (req, res) => {
	Token.findAll()
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving tokens, " + err
        });
    });
};

// Stop selling a token with id (delete)
exports.delete = (req, res) => {
    let id = req.params.id
    Token.destroy({
        where: { id: id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Token was deleted successfully!"
            });
        }
        else {
            res.send({
                message: `Token was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: `Could not delete question with id=${id}. ${err}`
        })
    });
}