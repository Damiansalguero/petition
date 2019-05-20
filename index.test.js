//test file should be in same directory as the file you want to test
const supertest = require("supertest");
const { app } = require("./index");
//here we require the FAKE cookieSession, the one that lives in the "__mocks__" driectory
const cookieSession = require("cookie-session");
const obj = {};

//here obj is our cookie
cookieSession.mockSession(obj);
return supertest(app)
    .post("/welcome")
    .then(res => {
        expect(obj).toEqual({
            submitted: true
        });
    });

// test("GET /home returns an h1 as respone", () => {
//     //makes the request
//     return (
//         supertest(app)
//             .get("/home")
//             //varWithAnyName recieves the response
//             .then(varWithAnyName => {
//                 // console.log("vario", varWithAnyName);
//                 console.log("headers", varWithAnyName.headers);
//                 expect(varWithAnyName.statusCode).toBe(200);
//                 expect(varWithAnyName.text).toBe("<h1>home</h1>");
//                 expect(varWithAnyName.headers["content-type"]).toContain(
//                     "text/html"
//                 );
//             })
//     );
// });

// test("GET /home with cookies causes me to be redirected", () => {
//     return supertest(app)
//         .get("/home")
//         .then(res => {
//             // I want to check if I'm actually being redirected
//             // 1. 302
//             // 2. header called "location"
//             // location header gives me the route that I've been redirected to
//             expect(res.statusCode).toBe(302);
//             expect(res.headers.location).toBe("/register");
//         });
// });
// 3 main properties of varWithAnyName we're interested in are:
// 1. "text" (gives us body of response)
// 2. "headers" (gives us the headers that were sent as part of response)
// 3  "" ( gives us )

// test('GET /home request sends h1 as response when "whatever" cookie is sent', () => {
//     //we mock the npm packages that we have to use but did not create a fake cookie
//     cookieSession.mockSessionOnce({
//         whatever: true
//     });

//now when we use supertetst to make our request to the server, the fake cookie will automatically be sent along with the request (without us explicitly telling it to do so)
//     return supertest(app)
//         .get("/home")
//         .then(res => {
//             console.log("body of the response", res.text);
//         });
// });

test('POST /welcome should set "submited" cookie', () => {
    // we will need to work with mockSessionOnce if we want to:
    // 1. send a test/dummy version of a cookie as part of the REQUEST we make to the server
    //2. if we need to see the cooie we receive as part of the response. In other words, if we need to check a cookie has been set, then we'll need mockSessionOnce/mockSessionOnce
});
