import server from "../src/server.js";

const app = server.app();

app.all("*", (req, res) => {
  console.log("Request received", process.pid);

  // console.log(req.pb);

  res.send("Hello World!");
});
