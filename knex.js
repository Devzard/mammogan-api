const connectedKnex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./maindb.sqlite3",
  },
  useNullAsDefault: true,
});

module.exports = connectedKnex;
