require("dotenv").config();
const { DATABASE_URL } = process.env;
const spicedPg = require("spiced-pg");
const db = spicedPg(DATABASE_URL);

module.exports.getAllSignatures = () => {
    return db.query(`SELECT * FROM signatures;`);
};

module.exports.getAllSigned = () => {
    return db.query(`
        SELECT * FROM users
        INNER JOIN signatures
        ON users.id = signatures.user_id
        FULL JOIN users_profiles
        ON users.id = users_profiles.user_id;`);
};

module.exports.getOneCity = (city) => {
    return db.query(`
        SELECT * FROM users
        INNER JOIN signatures
        ON users.id = signatures.user_id
        INNER JOIN users_profiles
        ON users.id = users_profiles.user_id
        WHERE city = $1;`, [city]);
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

module.exports.addMoreData = (age, city, page, userID) => {
    return db.query(
        `INSERT INTO users_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING *;`,
        [age, city, page, userID]
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
