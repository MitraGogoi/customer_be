const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "GraphQL Service",
  });
});

app.get("/internal", (req, res) => {
  return res.status(200).json({
    message: "calling from internal backend ms",
  });
});

app.listen(80, () => {
  console.log("backend is lstening at 8000");
});
