const express = require("express");
const app = express();
const db = require("./utils/db");
const bc = require("./utils/bc");
const hb = require("express-handlebars");
const bodyParse = require("body-parser");
const cookieSession = require("cookie-session");

//Access to css/html
app.use(express.static("./public"));

//Cookie session
app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

//Setup handlebars
app.engine("handlebars", hb());
app.set("view engine", "handlebars");

// //Install body-parser and use it in your Express project.
app.use(
    bodyParse.urlencoded({
        extended: false
    })
);

//ROUTES

//Route "Registration"
app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    });
});

//Route "Login"
app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

//Route "Profile"
app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

//Add user to "users"
app.post("/register", (req, res) => {
    if (
        req.body.firstname === "" ||
        req.body.lastname === "" ||
        req.body.email === "" ||
        req.body.password === ""
    ) {
        res.render("register", {
            layout: "main",
            error: "Oops, something went wrong. Please try again"
        });
    } else {
        bc.hashPassword(req.body.password)
            .then(hashedPw => {
                console.log("hashed pw", hashedPw);
                // INSERT INTO users
                return db.addUser(
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email,
                    hashedPw
                );
            })
            // put userId in session
            .then(result => {
                console.log("userId", result);
                req.session.id = result.rows[0].id;
                req.session.firstname = result.rows[0].firstname;
                req.session.lastname = result.rows[0].lastname;
                res.redirect("/profile");
            })
            .catch(err => {
                console.log(err);
            });
        // hash Password
    }
});

app.post("/profile", (req, res) => {
    db.addUserInfo(
        req.body.age,
        req.body.city,
        req.body.homepage,
        req.body.user_id
    ).then(resultDb => {
        const userId = resultDb.rows[0].id;
        req.session.userId = userId;
    });
});

//POST for login
// app.post("/login", (req, res) => {
// get user's hash from db
// call checkPassword from bc.js to check password
// entered in input field with hash from db
// put userId in session
// check if user signed petition. if yes put signatureId in session
// });

//Route "petition"
app.get("/petition", (req, res) => {
    //signatureId = value of cookies; if existing then redirect
    if (req.session.signatureId) {
        res.redirect("/petition/signed");
    } else {
        res.render("petition", {
            layout: "main"
        });
    }
});

//Route to "signed"
app.get("/petition/signed", (req, res) => {
    Promise.all([db.getSignature(req.session.signatureId), db.signerNumber()])
        //resultDb returns data from the DB
        //resultDb contains 2 objects; the firts one refers to the first function and so on
        .then(resultDb => {
            // console.log(resultDb);
            res.render("signed", {
                layout: "main",
                signature: resultDb[0].rows[0].signature,
                count: resultDb[1].rows[0].count
            });
        })
        .catch(err => {
            console.log(err);
        });
});

//Route to ("signers")
app.get("/petition/signers", (req, res) => {
    db.getNames(req.session.names).then(resultDb => {
        res.render("signers", {
            layout: "main",
            names: resultDb.rows
        });
    });
});

//Cookies
// app.get("/cookie-test", (req, res) => {
// session property comes from the middleware function we just pasted up above.
// req.session is an OBJECT!
// so what we're doing here is adding a proeprty to our cookie that's called "cookie", and the value of "cookie" is true.
// req.session.userId = 3;
// res.redirect("/petition/signers");
// });

// every single route in my server (so every single app.get and app.post) will have this "req.session" object.

//POST Route
app.post("/petition", (req, res) => {
    //if statement guarantees, that all 3 infos need to be passed
    if (
        req.body.firstname === "" ||
        req.body.lastname === "" ||
        req.body.signature === ""
    ) {
        //Renders error meesage in case one of the infos haven't been passed
        res.render("petition", {
            layout: "main",
            error: "Oops, something went wrong. Please try again"
        });
    } else {
        db.addSignature(
            //das letzte in der Kette ist "name = ..." im html, da man hier auf den body zugreift
            req.body.signature
            //Session is promise (object)
        ).then(resultDb => {
            const signatureId = resultDb.rows[0].id;
            //Id of the signature
            req.session.signatureId = signatureId;
            res.redirect("/petition/signed");
        });
    }
});

//Log out route
// app.get("/logout", (req, res) => {
//     req.session = null;
//     res.redirect("/register");
// });

app.listen(process.env.PORT || 8080, () => console.log("Listening"));
