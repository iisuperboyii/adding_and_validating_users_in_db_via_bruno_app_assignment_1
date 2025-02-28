const express = require('express');
const { resolve } = require('path');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json()); // Add this line to parse JSON request bodies

mongoose.connect('mongodb+srv://aaronjomon24:aaronjomon5@aaronjomon.jvfff.mongodb.net/?retryWrites=true&w=majority&appName=aaronjomon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});