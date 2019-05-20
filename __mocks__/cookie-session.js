let tempSession,
    session = {};

// this is a copy of the cookie session middleware
module.exports = () => (req, res, next) => {
    req.session = tempSession || session;
    tempSession = null;
    next();
};

//mockSession can be used for multiple tests
module.exports.mockSession = sess => (session = sess);

//mockSessionOnce can only be used for 1 test
module.exports.mockSessionOnce = sess => (tempSession = sess);

//Example
// mockSession({
// userid: 9
// });
//Result
// session = { userid: 9 };
//Therefore
// req.session = { userid: 9 };
