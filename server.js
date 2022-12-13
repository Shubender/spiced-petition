// require modules that you will need and set up your express app (EASY)
const express = require("express");
const app = express();
const helmet = require("helmet");
const {
    getAllSignatures,
    addSignature,
    addUserData,
    getAllUsers,
} = require("./db.js");
const { hashPass, compare } = require("./encrypt");
let showWarning = false;
let signersCount;
let allData;
let userData;
let userHash;
let usersData;
let passCompare;
let finalImg;
let fNameThanks;

// const req = require("express/lib/request.js");

// setup handlebars for your express app correctly (EASY)
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

// apply different middlewares like:
//  - express.static for static files (EASY)
//  - express.urlencoded for ready the body of POST requests (EASY)
app.use(express.static("./public"));
app.use(express.static("./public/images"));
app.use(express.urlencoded());
app.use(helmet());

const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use((req, res, next) => {
    if (req.url.startsWith("/petition") && req.session.signed) {
        res.redirect("/thanks");
    } else if (req.url.startsWith("/thanks") && !req.session.signed) {
        res.redirect("/petition/");
    } else {
        next();
    }
});

// Create multiple routes for your express app:
app.get("/", (req, res) => {
    showWarning = false;
    res.redirect("/petition/");
});

app.get("/registration", (req, res) => {
    res.render("registration", {
        layout: "main",
    });
});

app.post("/registration", (req, res) => {
    let fName = req.body.fname;
    let lName = req.body.lname;
    let regEmail = req.body.email;
    let regPass = req.body.password;
    // console.log('user data: ', fName, lName, regEmail, regPass);
    hashPass(regPass).then((hash) => {
        // console.log("hashed data: ", hash);
        addUserData(fName, lName, regEmail, hash)
            .then((data) => {
                req.session.registered = data.rows[0].id;
                res.redirect("/petition/");
            })
            // if insert fails, re-render template with an error message
            //     - NEVER store the user's plain-text password in the database!!!
            .catch((err) => console.log("Register error: ", err));
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
    });
});

app.post("/login", (req, res) => {
    let regEmail = req.body.email;
    console.log('user email: ', regEmail);
    let regPass = req.body.password;
    getAllUsers()
        .then((data) => {
            // usersData = data.rows;
            // console.log("all users: ", data.rows);
            for (let i = 0; i < data.rows.length; i++) {              //how to stop loop when results are found?
                // console.log("loop of emails: ", data.rows[i].email);
                if (data.rows[i].email === regEmail) {
                    userHash = data.rows[i].password;
                    console.log("Hash in DB: ", userHash);
                    hashPass(regPass).then((hash) => {
                        console.log("Hash from login: ", hash);
                        compare(userHash, hash, function (err, res) {
                            if (res) {
                                passCompare = res;
                            } else {
                                console.log("Password not match!");
                            }
                        });
                        if (passCompare) {
                            console.log("Hash compare OK");
                        }
                    });
                } 
                // else if (i = data.rows.length) {
                //     console.log("No such account");
                // }
            }
            res.redirect("/login/");
        })
        .catch((err) => console.log("Login error: ", err));
});

//  - one route for renderering the petition page with handlebars (EASY)
app.get("/petition", (req, res) => {
    getAllSignatures()
        .then((data) => {
            signersCount = data.rows.length;
            // console.log("signersCount: ", signersCount);
            res.render("petition", {
                layout: "main",
                showWarning,
                signersCount,
            });
        })
        .catch((err) => console.log(err));
});

app.post("/petition", (req, res) => {
    let fName = req.body.fname;
    let lName = req.body.lname;
    let canvasPic = req.body.signature;
    // console.log("canvasPic: ", canvasPic);

    if (fName === "" || lName === "" || !canvasPic) {
        //not work for canvasPic!
        showWarning = true;
        res.redirect("/petition/");
    }

    if (fName !== "" && lName !== "" && canvasPic) {
        showWarning = false;
        addSignature(fName, lName, canvasPic)
            .then((data) => {
                // console.log("user id:", data.rows[0].id);
                req.session.signed = data.rows[0].id;
                fNameThanks = data.rows[0].firstname;
                res.redirect("/thanks/");
            })
            .catch((err) => console.log(err));
    }
    // console.log("First name: ", fName, "Last name: ", lName);
});

//  - one route for rendering the thanks page with handlebars (EASY); make sure to get information about the number of signers (MEDIUM)
app.get("/thanks", (req, res) => {
    getAllSignatures()
        .then((data) => {
            allData = data.rows;
            // console.log("allData: ", allData);
            signersCount = allData.length;
            // console.log("signersCount: ", signersCount);
            userData = data.rows.find((el) => {
                return el.id === req.session.signed;
            });
            finalImg = userData.signature;
            res.render("thanks", {
                layout: "main",
                signersCount,
                allData,
                fNameThanks,
                finalImg,
            });
        })
        .catch((err) => console.log(err));
});

//  - one route for rendering the signers page with handlebars (EASY); make sure to get all the signature data from the db before (MEDIUM)
//  - one route for POSTing petition data -> update db accordingly (MEDIUM)
app.get("/signers", (req, res) => {
    getAllSignatures()
        .then((data) => {
            allData = data.rows;
            res.render("signers", {
                layout: "main",
                allData,
                signersCount,
            });
            //add helper to cut lName
        })
        .catch((err) => console.log(err));
});

app.listen(8080, console.log("running at 8080"));
