const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const fs = require("fs");

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  expressSession({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

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

app.get("/admin/next/meeting", (req, res) => {
  const query = `
    SELECT *
    FROM bookings
    WHERE date = CURDATE() AND time > CURTIME()
    OR date > CURDATE()
    ORDER BY date ASC, time ASC
    LIMIT 1
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching next booking:", err);
      res.status(500).json({ error: "Failed to fetch next booking" });
      return;
    }
    res.json(results);
  });
});

app.get("/admin/meeting/times", (req, res) => {
  const query = "SELECT * FROM times";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching meeting times:", err);
      res.status(500).json({ error: "Failed to fetch meeting times" });
      return;
    }
    res.json(results);
  });
});

app.post("/admin/meeting/times", (req, res) => {
  const { time, active } = req.body;

  // Toggle active state using a SQL UPDATE query
  connection.query(
    "UPDATE times SET active = CASE WHEN active = 1 THEN 0 ELSE 1 END WHERE time = ?",
    [time],
    (error, results) => {
      if (error) {
        console.error("Error updating meeting times:", error);
        res.status(500).json({ error: "Failed to update meeting times" });
        return;
      }
      res.sendStatus(200); // Send success status if the update was successful
    }
  );
});

app.get("/admin/auth/login", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/admin/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "bond" && password === "admin") {
    req.session.user = { username };
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post("/admin/time/add", (req, res) => {
  const { time } = req.body;

  // Assuming 'times' table has 'time' and 'active' columns
  const insertQuery = "INSERT INTO times (time, active) VALUES (?, 1)";

  connection.query(insertQuery, [time], (error, results) => {
    if (error) {
      console.error("Error adding time:", error);
      res.status(500).json({ error: "Failed to add time" });
      return;
    }
    res.sendStatus(200); // Send success status if insertion was successful
  });
});

app.get("/bookings", (req, res) => {
  const query = "SELECT * FROM bookings"; // Replace 'bookings' with your actual table name

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching bookings data:", err);
      res.status(500).json({ error: "Failed to fetch bookings data" });
      return;
    }
    res.json(results);
  });
});

app.get("/active", (req, res) => {
  const query = "SELECT * FROM times WHERE active = 1";

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching active time slots:", err);
      res.status(500).json({ error: "Failed to fetch active time slots" });
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
});

app.get("/admin/meeting/today", (req, res) => {
  const today = new Date().toISOString().slice(0, 10); // Get today's date in 'YYYY-MM-DD' format

  const query = "SELECT * FROM bookings WHERE DATE(date) = ?"; // Filter events for today

  connection.query(query, [today], (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      res.status(500).json({ error: "Failed to fetch events" });
      return;
    }
    console.log(results)
    res.json(results); // Send the fetched events as a JSON response
  });
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
