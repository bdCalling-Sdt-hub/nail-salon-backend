const express = require("express");
const cors = require("cors");
const app = express();
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const routes = require("./routes");

//parser
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", routes);

//image get
app.use(express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Happy to see you Dear!");
});

//global error handler
app.use(globalErrorHandler);

module.exports = app;
