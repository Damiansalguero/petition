// spicedPg setup
const spicedPg = require("spiced-pg");

// process.env.NODE_ENV === "production" ? secrets = process.env ? secrets = require('/secrets.json')
//DB Auth
const dbUrl =
    process.env.DATABASE_URL ||
    `postgres:postgres:postgres@localhost:5432/salt-petition`;
var db = spicedPg(dbUrl);

//Database Queries
//Add signature to "signatures" database
module.exports.addSignature = function addSignature(signature, user_id) {
    return db.query(
        `
        INSERT INTO signatures (signature, user_id)
        VALUES ($1, $2)
        RETURNING id;
        `,
        [signature, user_id]
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
//Get signers
module.exports.getSigners = function getSigners(city) {
    //this function expects a city
    //shows results by city
    if (city) {
        return db.query(
            `
            SELECT firstname, lastname, age, city, homepage
            FROM signatures
            LEFT OUTER JOIN users ON signatures.user_id = users.id
            LEFT OUTER JOIN user_profiles ON signatures.user_id = user_profiles.user_id
            WHERE LOWER(city) = LOWER($1);
            `,
            [city]
        );
    } else {
        //Shows all the signers from all cities
        return db.query(`
            SELECT firstname, lastname, age, city, homepage
            FROM signatures
            LEFT OUTER JOIN users ON signatures.user_id = users.id
            LEFT OUTER JOIN user_profiles ON signatures.user_id = user_profiles.user_id
            `);
    }
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
        INSERT INTO user_profiles (age, city, homepage, user_id)
        VALUES ($1, $2, $3, $4);
        `,
        [age, city, homepage, user_id]
    );
};
//Login getting Data
module.exports.loginCheck = function loginCheck(email) {
    return db.query(
        `
        SELECT email, password, users.id AS user_id, signatures.id AS sign_id
        FROM users
        LEFT OUTER JOIN signatures ON signatures.user_id = users.id
        WHERE email = $1;`,
        [email]
    );
};
