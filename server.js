const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

global.__basedir = __dirname;
console.log(__dirname)

const app = express();

var corsOptions = {
    origin: "http://localhost:4200",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync().then(() => {
  console.log("Drop and re-sync db.");
});

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.get('/api/book/download', function(req, res){
    const file = `${__dirname}/files/1662004024263[-]CV - Tran Viet Anh [ENG].pdf`;
    res.download(file); // Set disposition and send it.
});

require("./routes/user.routes")(app);
require("./routes/book.routes")(app);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
