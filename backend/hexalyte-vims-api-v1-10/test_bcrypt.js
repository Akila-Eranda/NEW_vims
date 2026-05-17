const bcrypt = require("bcryptjs");
const hash = "$2b$10$9MU8LimVJBdaF1NrojpdquF/NeXx5f.XjJGAY/RcUhHgVeP677jvq";
bcrypt.compare("Admin@123", hash).then(r => console.log("Match:", r));
