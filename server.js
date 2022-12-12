// require modules that you will need and set up your express app (EASY)
const express = require("express");
const app = express();
const { getAllSignatures, addSignature } = require("./db.js");
let showWarning = false;
let signersCount;
let allData;
let userData;
let finalImg;
let fNameThanks;
// let cookieID = 0;

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


// app.get("/thanks", (req, res) => {
//     if (req.session.signed === 0) {
//         res.redirect("/petition/");
//     } 
// });

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
    console.log("canvasPic: ", canvasPic);

    if (fName === "" || lName === "" || !canvasPic) { //not work for canvasPic!
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
