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

module.exports.getAllSigned = () => {
    return db.query(`SELECT * FROM users INNER JOIN signatures ON users.id = signatures.user_id;`);
};

module.exports.addSignature = (canvasPic, userID) => {
    return db.query(
        `INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING *;`,
        [canvasPic, userID]
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

module.exports.getUserByID = (id) => {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

module.exports.ifUserSigned = (id) => {
    return db.query(`SELECT * FROM signatures WHERE user_id = $1`, [id]);
};