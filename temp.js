const DB = require("./services/Database");

(async () => {
  let res = await DB.editUser("1", "456", "ramu", "ramu@fake");
  console.log(res);
})();
