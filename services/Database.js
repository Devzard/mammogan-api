const knex = require("../knex");

async function initTables() {
  try {
    await knex.schema.hasTable("users").then((exists) => {
      if (!exists) {
        return knex.schema.createTable("users", function (table) {
          table.uuid("id").primary();
          table.string("password");
          table.string("name");
          table.string("email");
          table.unique("email");
          table.bigint("last_active");
        });
      }
    });

    await knex.schema.hasTable("application_access_table").then((exists) => {
      if (!exists) {
        return knex.schema.createTable(
          "application_access_table",
          function (table) {
            table.increments("id").primary();
            table.string("userId");
            table.string("app_name");
          }
        );
      }
    });
    console.log("Tables initialised");
  } catch (err) {
    console.log(err.message);
  }
}
initTables();

async function getAllUsers() {
  try {
    let res = await knex
      .select("id", "name", "email", "last_active")
      .from("users");
    return res;
  } catch (err) {
    console.log(err.message);
    return [];
  }
}

async function insertIntoUsers(id, password, name, email) {
  try {
    await knex("users").insert({
      id: id,
      password: password,
      name: name,
      email: email,
      last_active: Date.now(),
    });
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

async function editUser(id, password, name, email) {
  try {
    await knex("users").where("id", "=", id).update({
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
  // let res2 = await knex.select("*").from("users");
  // let res2 = await editUser("1", "456", "ramu", "987654321");
  // console.log(res2);
  console.log("--");
})();

module.exports = { insertIntoUsers, editUser, getAllUsers };
