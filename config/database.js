const MongoClient = require("mongodb").MongoClient;
let mongo = {};
let db;
let disconnectTimer;
let retryTimer;
let disconnect; //Used to prevent mongo from reconnect.

mongo.connect = async () => {
    disconnect = false;
    let promise;
    try {
        promise = new Promise((resolve, reject) => {
            MongoClient.connect('mongodb://localhost/beaSec', (error, database) => {
                if (error) {
                    console.warn("Error connecting to Database =", error);
                    setRetryTimer();
                }
                else {
                    console.log("Database connected.");
                    db = process.env.NODE_ENV == "production" ? database.db("beaSec") : database.db("beaSec");

                    mongo.resetDisconnectTimer();

                    //Database events
                    db.on("close", (event) => {
                        console.log("Database disconnected.");
                        if (!disconnect)
                            setRetryTimer();
                    });
                    resolve(db);
                }
            });
        });
        return await promise;
    } catch (error) {
        throw error;
    }
}
mongo.disconnect = () => {
    disconnect = true;
    try {
        db.close();
    } catch (error) {
        console.warn("Error closing connection to Database =", error);
        throw {
            statusCode: 404,
            error: error.toString(),
            reason: "",
            details: ""
        };
    }
}
mongo.getDB = () => {
    if (typeof db !== "undefined" && !disconnect)
        return db;
    else
        return mongo.connect();
}
mongo.resetDisconnectTimer = () => {
    if (typeof timer !== "undefined") clearTimeout(timer);
    //Sets disconnectTimer to close database connection after 30 minutes of inactivity.
    disconnectTimer = setTimeout(() => {
        console.log("Disconnecting from Database due inactivity...");
        disconnect = true;
        mongo.disconnect();
    }, 18000000);
}
module.exports = mongo;

//Functions
let setRetryTimer = () => {
    //Sets retryTimer to reconnect after 2 minutes.
    console.log("Connection retry in 1 minute...");
    retryTimer = setTimeout(() => {
        console.log("Connecting...");
        mongo.connect().catch((error) => {
            setRetryTimer();
        });
    }, 60000);
}