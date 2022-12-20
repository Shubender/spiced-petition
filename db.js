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
    return db.query(
        `
        SELECT * FROM users
        INNER JOIN signatures
        ON users.id = signatures.user_id
        INNER JOIN users_profiles
        ON users.id = users_profiles.user_id
        WHERE city = $1;`,
        [city]
    );
};

module.exports.getUserById = (userID) => {
    return db.query(
        `
        SELECT * FROM users
        FULL JOIN users_profiles
        ON users.id = users_profiles.user_id
        WHERE user_id = $1;`,
        [userID]
    );
};

module.exports.updateUser = (fName, lName, regEmail, userID) => {
    return db.query(
        `
        UPDATE users
        SET first = $1,
            last = $2,
            email = $3
        WHERE id = $4;`,
        [fName, lName, regEmail, userID]
    );
};

module.exports.updatePass = (updatePass, userID) => {
    return db.query(
        `
        UPDATE users
        SET password = $1
        WHERE id = $2;`,
        [updatePass, userID]
    );
};

module.exports.updateUserProfile = (age, city, page, userID) => {
    return db.query(
        `
        UPDATE users_profiles
        SET age = $1,
            city = $2,
            url = $3
        WHERE user_id = $4;`,
        [age, city, page, userID]
    );
};

module.exports.addSignature = (canvasPic, userID) => {
    return db.query(
        `INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING *;`,
        [canvasPic, userID]
    );
};

module.exports.deleteSignature = (userID) => {
    return db.query(
        `
        DELETE FROM signatures
        WHERE user_id = $1;`,
        [userID]
    );
};

module.exports.deleteUser = (userID) => {
    return db
        .query(
            `
            DELETE FROM users_profiles
            WHERE user_id = $1`,
            [userID]
        )
        .then(() => {
            db.query(
                `
                DELETE FROM signatures
                WHERE user_id = $1;`,
                [userID]
            );
        })
        .then(() => {
            db.query(
                `
                DELETE FROM users
                WHERE id = $1;`,
                [userID]
            );
        })
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

module.exports.getUserByEmail = (email) => {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

module.exports.ifUserSigned = (id) => {
    return db.query(`SELECT * FROM signatures WHERE user_id = $1`, [id]);
};
