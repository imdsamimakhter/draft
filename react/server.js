const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const USERS_FILE = "./users.json";

// Read users.json or initialize it if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Sign Up Endpoint
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users));
  res.status(201).json({ message: "User signed up successfully!" });
});

// Sign In Endpoint
app.post("/signin", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    res.status(200).json({ message: "Sign-in successful!" });
  } else {
    res.status(400).json({ message: "Invalid username or password!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
