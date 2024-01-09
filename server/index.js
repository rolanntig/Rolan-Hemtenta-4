
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");



const app = express();
const port = 3001;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bookList",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }

  console.log("Connected to database with ID " + connection.threadId);
});

app.get("/bookings", (req, res) => {
    connection.query("SELECT * FROM bookings", (error, results, fields) => {
        console.log(results);
    if (error) {
      console.error("Error querying database: " + error.stack);
      return;
    }

    res.json(results);
  });
});

app.post("/booking/finalize", (req, res) => {
  const { name, last_name, email, phone, date, time } = req.body;

  connection.query(
    "INSERT INTO bookings (name, last_name, email, phone, date, time) VALUES (?, ?, ?, ?, ?, ?)",
    [name, last_name, email, phone, date, time],
    (error, results, fields) => {
      if (error) {
        console.error("Error querying database: " + error.stack);
        return;
      }

      res.json(results);
    }
  );
}
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
