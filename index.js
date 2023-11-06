require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const { DB_URL } = require("./configs/db.config");
const { PORT } = require("./configs/server.config");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(`${DB_URL}`)
  .then(() => console.log("Connected to mongodb successfully"))
  .catch((ex) => console.log("Error occurred", ex));

require("./routes/auth.route")(app);
require("./routes/theatre.route")(app);
require("./routes/payment.route")(app);
require("./routes/movie.route")(app);
require("./routes/booking.route")(app);
require("./routes/user.route")(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
