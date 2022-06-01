const knex = require("../knex");

async function initTables() {
  try {
    await knex.schema.hasTable("users").then((exists) => {
      if (!exists) {
        return knex.schema.createTable("users", function (table) {
          table.uuid("id").primary();
          table.string("password");
          table.string("name");
          table.unique("email");
        });
      }
    });
    console.log("Tables initialised");
  } catch (err) {
    console.log(err.message);
  }
}
initTables();

async function insertIntoUsers(id, password, name, email) {
  try {
    await knex("users").insert({
      id: id,
      password: password,
      name: name,
      email: email,
    });
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

(async () => {
  //   let res = await knex.select("*").from("test");
  //   let res = await knex("test").insert({ name: "raju", age: 34 });
  //   let res = await knex.schema.createTable("test2", function (table) {
  // table.string("name");
  // table.string("class");
  //   });
  // let res = await insertIntoUsers("1", "12", "123", "1234");
  //   let res = await knex.schema.createTable("users", function (table) {
  //     table.string("id");
  //     table.string("password");
  //     table.string("name");
  //     table.string("email");
  //   });
  let res2 = await knex.select("*").from("users");
  console.log(res2);
})();

module.exports = { insertIntoUsers };
