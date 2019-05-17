// spicedPg setup
const spicedPg = require("spiced-pg");

//DB Auth
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/salt-petition`;
var db = spicedPg(dbUrl);

//Database Queries
//Add signature to "signatures" database
module.exports.addSignature = function addSignature(signature) {
    return db.query(
        `
        INSERT INTO signatures (signature)
        VALUES ($1)
        RETURNING id;
        `,
        [signature]
    );
};
//get signature from database
module.exports.getSignature = function getSignature(signatureId) {
    //id here comes from db.js
    return db.query(`SELECT signature FROM signatures WHERE id = $1;`, [
        signatureId
    ]);
};
//get total count of people signed
module.exports.signerNumber = function signerNumber() {
    return db.query(`SELECT COUNT (*) FROM signatures;`);
};
//Get names
module.exports.getNames = function getNames() {
    return db.query(`SELECT firstname, lastname FROM users;`);
};

//Add user to "users" table
module.exports.addUser = function addUser(
    firstname,
    lastname,
    email,
    password
) {
    return db.query(
        `
        INSERT INTO users (firstname, lastname, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, firstname, lastname;
        `,
        [firstname, lastname, email, password]
    );
};

//Add profile info to "user_profiles" table
module.exports.addUserInfo = function addUserInfo(
    age,
    city,
    homepage,
    user_id
) {
    return db.query(
        `
        INSERT INTO users (age, city, homepage, user_id)
        VALUES ($1, $2, $3, $4);
        `,
        [age, city, homepage, user_id]
    );
};
