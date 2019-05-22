const express = require("express");
const app = express();
//For importing it into test file
exports.app = app;
const db = require("./utils/db");
const bc = require("./utils/bc");
const hb = require("express-handlebars");
const bodyParse = require("body-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

// const { requireNoSignature } = require("./middleware");

//Access to css/html
app.use(express.static("./public"));

//Importing and using router
// const profileRouter = require("./routers/profile");
// app.use(profileRouter);

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

//csurf use
//To protect your Petition against CSRF attacks
app.use(csurf());

app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    res.locals.users = req.session.userId;
    next();
});
//================= Routes for testing ====================================
// app.get("/home", (req, res) => {
//     //checks for cookie
//     if (!req.session.whatever) {
//         res.redirect("/register");
//     } else {
//         res.send("<h1>hello</h1>");
//     }
// });
// //the purpose of this route is to see how to write a unit that will confirm that a certain cookie has been set
// app.post("/welcome", (req, res) => {
//     req.session.submitted = true;
//     res.redirect("/register");
// });
//================= Routes for testing ====================================
//ROUTES

//Route "Registration"
app.get("/register", (req, res) => {
    res.render("register", {
        layout: "main"
    });
});

app.get("/", (req, res) => {
    res.render("register", {
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
                req.session.userId = result.rows[0].id;
                req.session.firstname = result.rows[0].firstname;
                req.session.lastname = result.rows[0].lastname;
                res.redirect("/profile");
            })
            .catch(err => {
                console.log(err);
            });
    }
});

//Route "Profile"
app.get("/profile", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/register");
    } else {
        res.render("profile", {
            layout: "main"
        });
    }
});

//Posting Data to users_profile
app.post("/profile", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/register");
    } else {
        db.addUserInfo(
            req.body.age,
            req.body.city,
            req.body.homepage,
            req.session.userId
        )
            .then(() => {
                res.redirect("/petition");
            })
            .catch(err => {
                console.log(err);
            });
    }
});

//Route "Login"
app.get("/login", (req, res) => {
    res.render("login", {
        layout: "main"
    });
});

// POST for login
app.post("/login", (req, res) => {
    // get user's hash from db
    db.userCheck(req.body.email).then(userInformation => {
        const hashedPw = userInformation.rows[0].password;
        // call checkPassword from bc.js to check password
        // entered in input field with hash from db
        bc.checkPassword(req.body.password, hashedPw)
            .then(() => {
                // put userId in session
                req.session.userId = userInformation.rows[0].user_id;
                req.session.sign_id = userInformation.rows[0].sign_id;
                if (req.session.sign_id) {
                    res.redirect("/petition/signed");
                } else {
                    res.redirect("/petition");
                }
            })
            .catch(err => {
                console.log(err);
            });
    });

    // check if user signed petition. if yes put signatureId in session
});

//Route "petition"
//requireNoSignature is callback function that runs
app.get("/petition", (req, res) => {
    console.log("session", req.session);
    //signatureId = value of cookies; if existing then redirect
    if (!req.session.userId) {
        res.redirect("/register");
    } else if (req.session.sign_id) {
        res.redirect("/petition/signed");
    } else {
        res.render("petition", {
            layout: "main"
        });
    }
});

//POST Route "petition"
app.post("/petition", (req, res) => {
    //if statement guarantees, that all 3 infos need to be passed
    if (req.body.signature === "") {
        //Renders error meesage in case one of the infos haven't been passed
        res.render("petition", {
            layout: "main",
            error: "Oops, something went wrong. Please try again"
        });
    } else {
        db.addSignature(
            //das letzte in der Kette ist "name = ..." im html, da man hier auf den body zugreift
            req.body.signature,
            req.session.userId
            //Session is promise (object)
        ).then(resultDb => {
            const signature_id = resultDb.rows[0].id;
            //Id of the signature
            req.session.sign_id = signature_id;
            res.redirect("/petition/signed");
        });
    }
});

//Route to "signed"
app.get("/petition/signed", (req, res) => {
    if (!req.session.sign_id) {
        res.redirect("/petition");
    } else {
        Promise.all([db.getSignature(req.session.sign_id), db.signerNumber()])
            //resultDb returns data from the DB
            //resultDb contains 2 objects; the firts one refers to the first function and so on
            .then(resultDb => {
                console.log("log Result", resultDb[0].rows[0]);
                res.render("signed", {
                    layout: "main",
                    signature: resultDb[0].rows[0].signature,
                    count: resultDb[1].rows[0].count
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
});

app.post("/petition/signed", (req, res) => {
    console.log("req.session", req.session);
    db.deleteSignature(req.session.sign_id)
        .then(() => {
            req.session.sign_id = null;
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
        });
});

//Route to ("signers")
app.get("/petition/signers", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/register");
    } else if (!req.session.sign_id) {
        res.redirect("/petition");
    } else {
        //FALSE here guarantees, that it goes straight to the second part of the code, since the original function expects a argument
        db.getSigners(false).then(resultSigners => {
            res.render("signers", {
                layout: "main",
                data: resultSigners.rows
            });
        });
    }
});

//Route to ("signers/:city")
app.get("/petition/signers/:city", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/register");
    } else if (!req.session.sign_id) {
        res.redirect("/petition");
    } else {
        db.getSigners(req.params.city).then(resultSigners => {
            res.render("signers", {
                layout: "main",
                data: resultSigners.rows
            });
        });
    }
});
// Route GET "edit"
app.get("/profile/edit", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/register");
    } else {
        db.getUserProfileInfo(req.session.userId).then(returnUser => {
            res.render("edit", {
                layout: "main",
                data: returnUser.rows
            });
        });
    }
});

//Route POST "edit"
app.post("/profile/edit", (req, res) => {
    console.log("req.body", req.body);
    if (req.body.password == "") {
        db.editUser(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.session.userId
        )

            .then(() => {
                db.editUserProfile(
                    req.body.age,
                    req.body.city,
                    req.body.homepage,
                    req.session.userId
                );
                res.redirect("/petition/signed");
            })
            .catch(err => {
                console.log(err);
                res.redirect("/register");
            });
    } else {
        bc.hashPassword(req.body.password).then(editResult => {
            console.log("editResult", editResult);
            const hashedPw = editResult;
            console.log("req.session", req.session);
            db.editUserPw(
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                hashedPw,
                req.session.userId
            )
                .then(() => {
                    db.editUserProfile(
                        req.body.age,
                        req.body.city,
                        req.body.homepage,
                        req.session.userId
                    );
                    res.redirect("/petition/signed");
                })
                .catch(err => {
                    console.log(err);
                    res.redirect("/register");
                });
        });
    }
});

// Log out route
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/register");
});

if (require.main == module) {
    app.listen(process.env.PORT || 8080, () => console.log("Listening"));
}
