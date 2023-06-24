import server from "../server.js";

server.http.all("*", (req, res) => {
  console.log("Request received", process.pid);

  res.send("Hello World!");
});

server.user.onCreate((user) => {
  console.log("User created.", user);
});

// server.user.onDelete((user) => {
//   console.log("User deleted.", user);
// });
