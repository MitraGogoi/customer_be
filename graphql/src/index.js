const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  //devx-namespace.local
  return res.status(200).json({
    message: "GraphQL Service",
  });
});

app.get("/internal", async (req, res) => {
  const response = await axios.get("devx-namespace.local:80");
  return res.status(200).json({
    message: "calling from internal backend ms",
    data: response.data,
  });
});

app.listen(80, () => {
  console.log("backend is lstening at 8000");
});
