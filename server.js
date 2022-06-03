const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDocs = require("swagger-jsdoc");
const path = require("path");
require("dotenv").config();

const fs = require("fs");
if (!fs.existsSync("./maindb.sqlite3")) {
  fs.appendFile("maindb.sqlite3", "", function (err) {
    if (err) {
      console.log("Failed at creating database");
      throw err;
    } else console.log("DB created");
  });
}

const PORT = process.env.PORT || 3300;

// options used for swagger documentation
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "gan-user-management-api",
      version: "1.0.0",
      description:
        "a user management system api for gan tool and other application",
    },
    servers: [
      {
        url: "http://127.0.0.1:3300",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsDocs(options);

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("*", function (req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "./public/") });
});
app.use("/s/admin", require("./routes/admin"));
app.use("/s/user", require("./routes/user"));

app.listen(PORT, () => console.log(`Server running at port : ${PORT}`));
