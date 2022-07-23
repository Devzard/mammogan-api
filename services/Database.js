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
          table.bigint("time_spent");
          table.integer("image_count");
          table.integer("image_saved_count");
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
            table.string("url");
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

//  *********
//  ADMIN
//  *********

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

async function getUser(id) {
  try {
    let res = await knex("users")
      .where({ id: id })
      .select(
        "id",
        "name",
        "email",
        "last_active",
        "time_spent",
        "image_count",
        "image_saved_count"
      );
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
      time_spent: 0,
      image_count: 0,
      image_saved_count: 0,
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

//  *********
//  USERS
//  *********

async function checkIfExistsUser(id) {
  try {
    let res = await knex.raw("select id, password from users where id = ?", [
      id,
    ]);
    return res;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

async function getUserAllowedApplications(id) {
  try {
    let res = await knex("application_access_table")
      .select("app_name", "url")
      .where({ userId: id });
    return res;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

async function patchUserAllowedApplications(id, appName, appUrl) {
  try {
    let allowedApplications = await getUserAllowedApplications(id);
    let res = null;
    if (allowedApplications.length == 0) {
      res = await knex("application_access_table").insert({
        userId: id,
        app_name:appName,
        url:appUrl
      });
    } else {
      res = await knex('application_access_table').where({userId:id, app_name:appName}).del();
    }
    return res
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

async function updateLastActive(id, addTime) {
  try {
    let timeSpent = await knex("users")
      .select("time_spent")
      .where("id", "=", id);
    timeSpent =
      timeSpent &&
      timeSpent.length &&
      timeSpent.length > 0 &&
      timeSpent[0].time_spent != null
        ? timeSpent[0].time_spent
        : 0;
    let res = await knex("users")
      .where("id", "=", id)
      .update({
        last_active: Date.now(),
        time_spent: timeSpent + addTime,
      });
    return res;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

async function updateCount(id, colName) {
  try {
    let prevCount = await knex.raw(
      `select ${colName} from users where id = ?`,
      [id]
    );
    prevCount =
      prevCount &&
      prevCount.length &&
      prevCount.length > 0 &&
      prevCount[0].image_count != null
        ? prevCount[0].image_count
        : 0;
    let res = await knex.raw(
      `update users set ${colName} = ${prevCount + 1} where id = ?`,
      [id]
    );
    return res;
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
  // let res = await updateLastActive("testuser", 1);
  // let res = await updateCount("test_user_1", "image_count");
  // let res = await getUserAllowedApplications('123')
  let res = await patchUserAllowedApplications('1234', 'gan', '/gan')
  console.log(res);
  console.log("--");
})();

module.exports = {
  insertIntoUsers,
  editUser,
  getAllUsers,
  getUser,
  checkIfExistsUser,
  getUserAllowedApplications,
  updateLastActive,
  updateCount,
};
