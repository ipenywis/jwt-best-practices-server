"use strict";

const http = require("http");
const autocannon = require("autocannon");
require("dotenv").config();

function startBench() {
  const url = "http://localhost:" + process.env.PORT || 5000;

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
        // by default we add an auth token to all requests
        "content-type": "application/json",
      },
      requests: [
        {
          method: "GET", // this should be a post for registering
          path: "/",
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
