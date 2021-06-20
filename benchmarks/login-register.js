"use strict";

const http = require("http");
const autocannon = require("autocannon");
require("dotenv").config();

const usersData = require("./users.json");

function startBench() {
  const url = "http://localhost:" + process.env.PORT || 5000;

  let requestNumber = 0;

  var args = process.argv.slice(2);
  const numConnections = args[0] || 1000;
  const maxConnectionRequests = args[1] || 1;

  const instance = autocannon(
    {
      url: url,
      connections: numConnections,
      duration: 10,
      maxConnectionRequests: maxConnectionRequests,
      headers: {
        "content-type": "application/json",
      },
      requests: [
        {
          method: "POST", // this should be a post for registering
          path: "/api/v1/register",
          setupRequest: (request) => {
            console.log("Request Number:", requestNumber + 1);

            request.body = JSON.stringify(usersData[requestNumber]);

            requestNumber++;
            return request;
          },
        },
        {
          method: "POST", // this should be a post for registering
          path: "/api/v1/login",
          setupRequest: (request) => {
            console.log("Request Number:", requestNumber + 1);

            request.body = JSON.stringify(usersData[requestNumber]);
            console.log("Data: ", request.body);

            requestNumber++;
            return request;
          },
        },
      ],
    },
    finishedBench
  );

  autocannon.track(instance);

  function finishedBench(err, res) {
    console.log("finished bench", err, res);
  }
}

startBench();
