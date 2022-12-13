const {genSalt, hash, compare} = require("bcryptjs");

module.exports.hashPass = (password) => genSalt().then((salt) => hash(password, salt));

module.exports.compare = compare;