
const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3001;

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
