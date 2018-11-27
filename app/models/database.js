let MongoClient = require("mongodb").MongoClient;
let models = {};
const mongo = require("../../config/database");

models.getLastTrack = (timer, callbackFunction) => {
  try {
    let db = mongo.getDB();
    db.collection("trackData", (error, collection) => {
      if (!error) {
        collection
          .find({ update: { $gte: timer } })
          .toArray((error, devices) => {
            if (error) {
              console.warn(
                "Error on collection devices find() method = ",
                error
              );
              if (typeof callbackFunction === "function")
                callbackFunction(
                  {
                    statusCode: 404,
                    error: "Couldn't find devices on database.",
                    reason: "",
                    details: error
                  },
                  undefined
                );
            } else if (typeof callbackFunction === "function") {
              callbackFunction(undefined, devices);
            }
          });
      } else if (typeof callbackFunction === "function")
        callbackFunction(
          {
            statusCode: 503,
            error: "Couldn't find devices collection.",
            reason: "",
            details: error
          },
          undefined
        );
    });
  } catch (error) {
    console.warn(`Error on getUsers [${error}]`);
    if (typeof callbackFunction === "function")
      callbackFunction("Error on getUsers.", undefined);
  }
};

models.addContacts = (user, callbackFunction) => {
  try {
    console.log(user);
    let db = mongo.getDB();
    db.collection("users", (error, collection) => {
      if (!error) {
        console.log("Collection users found.");
        collection.updateOne(
          { email: user.email },
          {
            $set: { contacts: user.contacts }
          },
          (error, success) => {
            if (error) {
              console.warn("Error on colletion users insert method =", error);
              if (typeof callbackFunction === "function")
                callbackFunction(
                  {
                    statusCode: 503,
                    error: "Couldn't update users on database.",
                    reason: "",
                    details: error
                  },
                  undefined
                );
            } else {
              console.log("User updated in users collection.");
              if (typeof callbackFunction === "function")
                callbackFunction(undefined, success);
            }
          }
        );
      } else
        callbackFunction(
          {
            statusCode: 503,
            error: "Couldn't find users collection.",
            reason: "",
            details: error
          },
          undefined
        );
    });
  } catch (error) {
    console.warn("Error on updateUsers =", error);
    if (typeof callbackFunction === "function")
      callbackFunction("Error on updateUsers.", undefined);
  }
};

models.getUsers = (email, callbackFunction) => {
  try {
    let db = mongo.getDB();
    db.collection("users", (error, collection) => {
      if (!error) {
        console.log("Collection users found.");
        collection.findOne({ email: email }, (error, users) => {
          if (error) {
            console.warn("Error on collection users find() method = ", error);
            if (typeof callbackFunction === "function")
              callbackFunction(
                {
                  statusCode: 404,
                  error: "Couldn't find users on database.",
                  reason: "",
                  details: error
                },
                undefined
              );
          } else if (typeof callbackFunction === "function")
            callbackFunction(undefined, users);
        });
      } else if (typeof callbackFunction === "function")
        callbackFunction(
          {
            statusCode: 503,
            error: "Couldn't find users collection.",
            reason: "",
            details: error
          },
          undefined
        );
    });
  } catch (error) {
    console.warn(`Error on getUsers [${error}]`);
    if (typeof callbackFunction === "function")
      callbackFunction("Error on getUsers.", undefined);
  }
};

models.resetTrackData = (options, callbackFunction) => {
  try {
    let db = mongo.getDB();
    db.collection("trackData", (error, collection) => {
      if (!error) {
        collection.aggregate([options], (err, cursor) => {
          cursor.toArray((error, documents) => {
            let promises = [];
            documents.map((document, i) => {
              promises.push(
                new Promise((resolve, reject) => {
                  collection.remove({ _id: document._id }, (error, success) => {
                    if (error) reject(error);
                    else resolve(success);
                  });
                })
              );
            });

            //Maps all promises.
            Promise.all(
              promises.map(p =>
                p.catch(error => {
                  console.log(error);
                })
              )
            )
              .then(promisesResults => {
                if (typeof callbackFunction === "function")
                  callbackFunction(undefined, "success");
              })
              .catch(error => {
                if (typeof callbackFunction === "function")
                  callbackFunction(
                    "Error while removing documents from users collection.",
                    undefined
                  );
              });
          });
        });
      } else if (typeof callbackFunction === "function")
        callbackFunction(
          {
            statusCode: 503,
            error: "Couldn't find users collection.",
            reason: "",
            details: error
          },
          undefined
        );
    });
  } catch (error) {
    console.warn("Error on removeUsers =", error);
    if (typeof callbackFunction === "function")
      callbackFunction("Error on removeUsers.", undefined);
  }
};

models.getLastLap = (options, callbackFunction) => {
  try {
    let db = mongo.getDB();
    db.collection("trackData", (error, collection) => {
      if (!error) {
        collection
          .find(options)
          .sort({ $natural: -1 })
          .limit(3)
          .toArray((error, success) => {
            if (error) {
              console.warn("Error on collection devices find method = ", error);
              if (typeof callbackFunction === "function") {
                callbackFunction(
                  {
                    statusCode: 404,
                    error: `Couldn't find laps on database`,
                    reason: "",
                    details: error
                  },
                  undefined
                );
              }
            } else if (typeof callbackFunction == "function") {
              callbackFunction(undefined, success);
            }
          });
      } else if (typeof callbackFunction == "function") {
        callbackFunction(
          {
            statusCode: 503,
            error: `Couldn't find devices on collection`,
            reason: "",
            details: error
          },
          undefined
        );
      }
    });
  } catch (error) {
    console.warn("Error on getSerieNumberDevice [", error, "]");
    if (typeof callbackFunction === "function") {
      callbackFunction("Error on getSerieNumberDevice", undefined);
    }
  }
};

models.inserTrack = (data, callbackFunction) => {
  try {
    let db = mongo.getDB();
    db.collection("trackData", (error, collection) => {
      if (!error) {
        console.log("Collection users found.");
        collection.insert(data, (error, success) => {
          if (error) {
            console.warn("Error on colletion track insert method =", error);
            if (typeof callbackFunction === "function")
              callbackFunction(
                {
                  statusCode: 503,
                  error: "Couldn't insert users on database.",
                  reason: "",
                  details: error
                },
                undefined
              );
          } else {
            console.log(
              "User inserted in users collection.",
              success.ops[0]._id
            );
            if (typeof callbackFunction === "function") {
              let successObj = {
                code: 200
              };
              callbackFunction(undefined, successObj);
            }
          }
        });
      } else
        callbackFunction(
          {
            statusCode: 503,
            error: "Couldn't find users collection.",
            reason: "",
            details: error
          },
          undefined
        );
    });
  } catch (error) {
    console.warn("Error on insertUsers =", error);
    if (typeof callbackFunction === "function")
      callbackFunction("Error on insertUsers.", undefined);
  }
};

models.updateLastLap = (data, callbackFunction) => {
  try {
    let db = mongo.getDB();
    db.collection("notifications", (error, collection) => {
      if (!error) {
        console.log(data);
        collection.updateOne(
          { _id: data._id },
          {
            $set: {
              message: data.message,
              alert_viewer: true
            }
          },
          (error, users) => {
            if (error) {
              console.warn("Error on collection users find() method = ", error);
              if (typeof callbackFunction === "function")
                callbackFunction(
                  {
                    statusCode: 404,
                    error: "Couldn't find users on database.",
                    reason: "",
                    details: error
                  },
                  undefined
                );
            } else if (typeof callbackFunction === "function") {
              callbackFunction(undefined, users);
            }
          }
        );
      } else if (typeof callbackFunction === "function")
        callbackFunction(
          {
            statusCode: 503,
            error: "Couldn't find users collection.",
            reason: "",
            details: error
          },
          undefined
        );
    });
  } catch (error) {
    console.warn(`Error on getUsers [${error}]`);
    if (typeof callbackFunction === "function")
      callbackFunction("Error on getUsers.", undefined);
  }
};

module.exports = models;
