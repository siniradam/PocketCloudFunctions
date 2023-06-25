import server from "../server/server.js";

server.http.all("*", (req, res) => {
  console.log("Request received", process.pid);

  res.send("Hello World!");
});

server.user.onCreate((user) => {
  console.log("User created.", user);
});
