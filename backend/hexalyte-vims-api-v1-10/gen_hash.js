const bcrypt = require("bcryptjs");
const hash = bcrypt.hashSync("Admin@123", 10);
console.log("New hash for Admin@123:", hash);
