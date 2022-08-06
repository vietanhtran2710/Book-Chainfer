const db = require("../models");
const User = db.users;
const sequelize = db.sequelize
const { QueryTypes, Op } = require('sequelize');

// Create a new User
exports.create = async (req, res) => {
	const userData = req.body
	if (!userData.address || !userData.fullName || !userData.email
    ) {
		res.status(400).send({
			message: "A required field is missing!"
		});
		return;
	}
    try {
        const user = {
            address: userData.address,
            fullName: userData.fullName,
            email: userData.email,
        }
        await User.create(user)
        res.status(201).send({ message: 'Create user successfully' })
    } catch (err) {
        res.status(500).send({
            error: err.message || "Some error occurred while creating the account."
        });
    }
}

// Retrieve single user with address
exports.getNonce = (req, res) => {
	const address = req.params.address;

	User.findByPk(address, {attributes: ['nonce']})
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving account with address=" + address + ", " + err
			});
		});
};