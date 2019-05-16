// spicedPg setup
const spicedPg = require("spiced-pg");

//DB Auth
var db = spicedPg("postgres:postgres:postgres@localhost:5432/salt-petition");

//database queries
module.exports.addSignature = function addSignature(
    firstname,
    lastname,
    signature
) {
    return db.query(
        `
        INSERT INTO signatures (firstname, lastname, signature)
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
        [firstname, lastname, signature]
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

module.exports.getNames = function getNames() {
    return db.query(`SELECT firstname, lastname FROM signatures;`);
};
