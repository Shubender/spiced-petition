require("dotenv").config();
const { DATABASE_URL } = process.env; // add a .env file next to the db.js file with your PostgreSQL credentials
const spicedPg = require("spiced-pg");
const db = spicedPg(DATABASE_URL);

// create the following functions:
//  - getAllSignatures - use db.query to get all signatures from table signatures
//  - addSignature - use db.query to insert a signature to table signatures
// Don't forget to export the functions with module.exports

module.exports.getAllSignatures = () => {
    return db.query(`SELECT * FROM signatures;`);
};

module.exports.addSignature = (fName, lName, canvasPic) => {
    return db.query(
        `INSERT INTO signatures (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING *;`,
        [fName, lName, canvasPic]
    );
};

module.exports.addUserData = (fName, lName, regEmail, regPass) => {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [fName, lName, regEmail, regPass]
    );
};

module.exports.getAllUsers = () => {
    return db.query(`SELECT * FROM users;`);
};

module.exports.getUserByEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};