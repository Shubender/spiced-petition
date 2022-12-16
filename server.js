// require modules that you will need and set up your express app (EASY)
const express = require("express");
const app = express();
const helmet = require("helmet");
const {
    getAllSignatures,
    addSignature,
    addUserData,
    getAllUsers,
    getUserByEmail,
    getUserByID,
    ifUserSigned,
    getAllSigned,
    addMoreData,
} = require("./db.js");
const { hashPass, compare } = require("./encrypt");
const PORT = 8080;
let showWarning = false;
let signersCount;
let allData;
let userData;
let dbHash;
let finalImg;
let fNameThanks;
let fName;
let lName;
let canvasPic;
let age;
let city;
let page;

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
    if (
        (req.url.startsWith("/registration") ||
            req.url.startsWith("/login") ||
            req.url.startsWith("/petition")) &&
        req.session.signid
    ) {
        res.redirect("/thanks");
    } else if (
        (req.url.startsWith("/thanks") ||
            req.url.startsWith("/signers") ||
            req.url.startsWith("/petition") ||
            req.url.startsWith("/profile")) &&
        !req.session.reglog
    ) {
        res.redirect("/registration/");
    } else {
        next();
    }
});

// Create multiple routes for your express app:
app.get("/", (req, res) => {
    showWarning = false;
    res.redirect("/registration/");
});

app.get("/registration", (req, res) => {
    res.render("registration", {
        layout: "main",
    });
});

app.post("/registration", (req, res) => {
    fName = req.body.fname;
    lName = req.body.lname;
    let regEmail = req.body.email;
    let regPass = req.body.password;
    // console.log('user data: ', fName, lName, regEmail, regPass);
    hashPass(regPass).then((hash) => {
        // console.log("hashed data: ", hash);
        addUserData(fName, lName, regEmail, hash)
            .then((data) => {
                req.session.reglog = data.rows[0].id;
                res.redirect("/profile/");
            })
            .catch((err) => console.log("Register error: ", err));
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main",
        showWarning,
    });
    showWarning = false;
});

app.post("/login", (req, res) => {
    let logEmail = req.body.email;
    // console.log("user email: ", logEmail);
    let logPass = req.body.password;
    getUserByEmail(logEmail)
        .then((data) => {
            // console.log("all data: ", data);
            if (data.rowCount === 0) {
                // console.log("rowCount: ", data.rowCount);
                showWarning = true;
                res.redirect("/login/");
                return;
            }
            // console.log("user from DB: ", data.rows);
            dbHash = data.rows[0].password;
            // console.log("Hash from DB: ", dbHash);
            compare(logPass, dbHash, function (err, result) {
                if (result) {
                    // console.log("compare: ", result);
                    req.session.reglog = data.rows[0].id;
                    fName = data.rows[0].first;
                    lName = data.rows[0].last;
                    ifUserSigned(req.session.reglog).then((data) => {
                        // console.log("have sign: ", data.rowCount);
                        if (data.rowCount !== 0) {
                            // console.log("user have sign!");
                            req.session.signid = data.rows[0].id;
                            res.redirect("/thanks/");
                            return;
                        }
                        res.redirect("/petition/");
                    });
                } else {
                    // console.log("Password not match!", err);
                    showWarning = true;
                    res.redirect("/login/");
                }
            });
        })
        .catch((err) => console.log("Login error: ", err));
});

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
        showWarning,
    });
    showWarning = false;
});

app.post("/profile", (req, res) => {
    age = req.body.age;
    city = req.body.city;
    page = req.body.page;
    // console.log("user additional data: ", age, city, page, req.session.reglog);
    // if (age === '')
    addMoreData(age, city, page, req.session.reglog)
        .then((data) => {
            res.redirect("/petition/");
        })
        .catch((err) => console.log("Profile error: ", err));
});

app.get("/petition", (req, res) => {
    getAllSignatures()
        .then((data) => {
            signersCount = data.rows.length;
            // console.log("signersCount: ", signersCount);
            res.render("petition", {
                layout: "main",
                showWarning,
                signersCount,
                fName,
                lName,
            });
            showWarning = false;
            // canvasPic = req.body.signature;
            // console.log("first enter canvasPic: ", canvasPic);
        })
        .catch((err) => console.log(err));
});

app.post("/petition", (req, res) => {
    // console.log("before click canvasPic: ", canvasPic);
    canvasPic = req.body.signature;
    // console.log("after click canvasPic: ", canvasPic);

    if (canvasPic === "") {
        //not work for canvasPic!
        showWarning = true;
        res.redirect("/petition/");
    } else {
        showWarning = false;
        addSignature(canvasPic, req.session.reglog)
            .then((data) => {
                // console.log("user id:", data.rows[0].id);
                req.session.signid = data.rows[0].id;
                // fNameThanks = data.rows[0].firstname;
                res.redirect("/thanks/");
            })
            .catch((err) => console.log(err));
    }
});

app.get("/thanks", (req, res) => {
    getAllSignatures()
        .then((data) => {
            // console.log("allData: ", allData);
            signersCount = data.rows.length;
            // console.log("signersCount: ", signersCount);
            userData = data.rows.find((el) => {
                return el.id === req.session.signid;
            });
            finalImg = userData.signature;
            res.render("thanks", {
                layout: "main",
                signersCount,
                allData,
                fName,
                finalImg,
            });
        })
        .catch((err) => console.log(err));
});

app.get("/signers", (req, res) => {
    getAllSigned()
        .then((data) => {
            allData = data.rows;
            // console.log("getAllSigned: ", allData);
            signersCount = data.rows.length;
            res.render("signers", {
                layout: "main",
                allData,
                signersCount,
            });
            //add helper to cut lName
        })
        .catch((err) => console.log(err));
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`running at ${PORT}`);
});
