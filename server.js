// require modules that you will need and set up your express app (EASY)
const express = require("express");
const app = express();

const { getAllSignatures, addSignature } = require("./db.js");

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

// Create multiple routes for your express app:
app.get("/", (req, res) => {
    res.redirect("/petition/");
});

//  - one route for renderering the petition page with handlebars (EASY)
app.get("/petition", (req, res) => {
    res.render("petition", {
        layout: "main",
    });
});

app.post("/petition", (req, res) => {
    let fName = req.body.fname;
    let lName = req.body.lname;
    const userSignature = "test";
    // console.log("First name: ", fName, "Last name: ", lName);
    addSignature(fName, lName, userSignature);
    res.redirect("/thanks/");
});

let signersCount;
let allData;
let fNameThanks;
//  - one route for rendering the thanks page with handlebars (EASY); make sure to get information about the number of signers (MEDIUM)
app.get("/thanks", (req, res) => {
    getAllSignatures()
        .then((data) => {
            allData = data.rows;
            // console.log("allData: ", allData);
            signersCount = allData.length;
            // console.log("signersCount: ", signersCount);
            fNameThanks = allData[allData.length - 1].firstname;
            // console.log("fNameThanks: ", fNameThanks);
            res.render("thanks", {
                layout: "main",
                signersCount,
                allData,
                fNameThanks,
            });
        })
        .catch((err) => console.log(err));
});

//  - one route for rendering the signers page with handlebars (EASY); make sure to get all the signature data from the db before (MEDIUM)
app.get("/signers", (req, res) => {
    res.render("signers", {
        layout: "main",
        signersCount,
        allData,
    });
});

//  - one route for POSTing petition data -> update db accordingly (MEDIUM)

app.listen(8080, console.log("running at 8080"));
