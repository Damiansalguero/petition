const express = require("express");
const router = express.Router();

//router is a method that has "get" and "post" methods on it (just like app in index.js)

//Route "Profile"
router.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main"
    });
});

//Posting Data to users_profile
router.post("/profile", (req, res) => {
    db.addUserInfo(
        req.body.age,
        req.body.city,
        req.body.homepage,
        req.session.user_id
    )
        .then(profileInfo => {
            // console.log(profileInfo);
            res.redirect("/petition");
        })
        .catch(err => {
            console.log(err);
        });
});

router
    .route("/profile")
    .get(requireNoSignature, (req, res) => {
        res.render("/profile", {
            layout: "main"
        });
    })
    .post((req, res) => {});

module.exports = router;
