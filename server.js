const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const PORT = process.env.PORT;

routes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
