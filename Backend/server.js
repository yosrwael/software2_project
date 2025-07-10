const mongoose = require("mongoose");
const app = require('./app');
require("dotenv").config('{ path: "E:\Downloads\SOFTWARE2_project-master\SOFTWARE2_project-master\SWE2-Project-master\Backend" }');

mongoose
  .connect(process.env.connect_DB)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((e) => console.log(e));