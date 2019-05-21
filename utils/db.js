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

//Delete signature
module.exports.deleteSignature = function deleteSignature(signature) {
    return db.query(
        `
        DELETE FROM signatures WHERE id = $1;
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
        return db.query(
            `
            SELECT firstname, lastname, age, city, homepage
            FROM signatures
            LEFT OUTER JOIN users ON signatures.user_id = users.id
            LEFT OUTER JOIN user_profiles ON signatures.user_id = user_profiles.user_id
            `
        );
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
module.exports.userCheck = function userCheck(email) {
    return db.query(
        `
        SELECT email, password, firstname, lastname, age, city, homepage,signatures.signature, users.id AS user_id, signatures.id AS sign_id
        FROM users
        LEFT OUTER JOIN signatures ON signatures.user_id = users.id
        LEFT OUTER JOIN user_profiles ON users.id = user_profiles.user_id
        WHERE email = $1;
        `,
        [email]
    );
};

module.exports.getUserProfileInfo = function getUserProfileInfo(userId) {
    return db.query(
        `
        SELECT firstname, lastname, email, age, city, homepage
        FROM users
        LEFT OUTER JOIN user_profiles ON users.id = user_profiles.user_id
        WHERE users.id = $1;
        `,
        [userId]
    );
};

//Editing user_profiles/users

module.exports.editUserPw = function editUserPw(
    firstname,
    lastname,
    email,
    password,
    id
) {
    return db.query(
        `
            UPDATE users SET firstname = $1, lastname = $2, email = $3, password = $4 WHERE id = $5;
        `,
        [firstname, lastname, email, password, id]
    );
};

module.exports.editUser = function editUser(firstname, lastname, email, id) {
    return db.query(
        `
            UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4;
        `,
        [firstname, lastname, email, id]
    );
};

module.exports.editUserProfile = function editUserProfile(
    age,
    city,
    homepage,
    user_id
) {
    return db.query(
        `
            INSERT INTO user_profiles (age, city, homepage, user_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id)
            DO UPDATE SET age=$1, city=$2, homepage=$3
        `,
        [age, city, homepage, user_id]
    );
};
