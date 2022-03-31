const express = require("express");
const app = express();

const port = 3000;
app.use(express.static("public"));
app.use("/public", express.static("public"));
app.get("/", function (req, res) {
  res.sendFile("./view/index.html", { root: __dirname });
});
app.listen(port, () => console.log(`listen to port${port}`));
