const redis = require("redis");
const client = redis.createClient(
    process.env.REDIS_URL || {
        host: "localhost",
        port: 6378
    }
);
client.on("error", err => {
    console.log("REDIS-err:", err);
});

//---------------- FOR DEMO ONLY----------------------
// client.setex('name', 120, 'damian').then()
//---------------- FOR DEMO ONLY----------------------

//Will autamtically promisify functions for us, that have node-style error-first callback
const { promisify } = require("util");
//SETEX puts data into redis
exports.setex = promisify(client.setex).bind(client);
//GET pulls or selects data from redis
exports.get = promisify(client.get).bind(client);
//DEL deletes data from redis
exports.del = promisify(client.del).bind(client);
