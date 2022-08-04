const db = require("../models");
const User = db.users;
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.config')  
const utils = require('@metamask/eth-sig-util');
const etherjs = require('ethereumjs-util');

exports.signIn = async (req, res) => {
	const { signature, publicAddress } = req.body;
	console.log(signature, publicAddress);
    try {
        let result = await User.findAll({
            where: {
                address: publicAddress
            }
        })

        if (result.length > 0) {
            let account = result[0].dataValues;
            const msg = `You are signing your one-time nonce to login: ${account.nonce}`;
            const msgBufferHex = etherjs.bufferToHex(Buffer.from(msg, 'utf8'));
            const address = utils.recoverPersonalSignature({
                data: msgBufferHex,
                signature: signature,
            });
            console.log(address);
            if (address.toLowerCase() === account.address.toLowerCase()) {
                let token = jwt.sign({ address: account.address, role: account.role }, authConfig.secret, {
                    expiresIn: "1d"
                })

                res.status(202).send({
                    address: account.address,
                    role: account.role,
                    token
                })
            } else {
                res.status(401).send({ message: 'Invalid signature' })
            }
        } else {
            res.status(400).send({ message: 'Your public address not found' })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err })
    }
}