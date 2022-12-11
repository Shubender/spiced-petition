require("dotenv").config();
const { SQL_USER, SQL_PASSWORD } = process.env; // add a .env file next to the db.js file with your PostgreSQL credentials
const spicedPg = require("spiced-pg");
const db = spicedPg(
    `postgres:${SQL_USER}:${SQL_PASSWORD}@localhost:5432/petition`
);

module.exports.getAllSignatures = () => {
    return db.query(`SELECT * FROM signatures;`);
};

// module.exports.getAllSignatures = () => {
//     return new Promise((resolve, reject) => {
//         const data = db.query(`SELECT * FROM signatures;`);
//         resolve(data);
//         reject("Error: Could not fetch data from the API");
//     });
// }

// module.exports.getAllSignatures = () => {
//     const data = db
//         .query(`SELECT * FROM signatures;`)
//         .then((data) => {
//             const signersCount = data.rows.length;
//             console.log("signersList: ", signersCount); // in rows property is the actual data
            
//         })
//         .catch((err) => {
//             console.log("getAllSignatures: error appeared for query: ", err);
//         });
//         return data;
// };

module.exports.addSignature = (fName, lName, userSignature) => {
    db.query(
        `INSERT INTO signatures (firstname, lastname, signature) VALUES ($1, $2, $3)`,
        [fName, lName, userSignature]
    ).catch((err) => {
        console.log("addSignature: error appeared for query: ", err);
    });
};

// create the following functions:
//  - getAllSignatures - use db.query to get all signatures from table signatures
//  - addSignature - use db.query to insert a signature to table signatures
// Don't forget to export the functions with module.exports
