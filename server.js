const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = __dirname + "/app/views/";

app.use(express.static(path));

var corsOptions = {
  origin: "http://localhost:8080",
  'Access-Control-Allow-Origin': '*'
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("[MONGODB] Connected to database at URL: " +  db.url);

  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
app.get('/', function(req,res){
  res.sendFile(path + "index.html");
})

require("./app/routes/user.routes")(app);



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[SERVER] Server is running on port ${PORT}.`);


});