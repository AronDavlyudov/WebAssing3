const express = require("express");
const bcrypt = require("bcryptjs");
const connectDB = require("../database/mongo");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const db = await connectDB();
    const existing = await db.collection("users").findOne({ username });

    if (existing) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    await db.collection("users").insertOne({
        username,
        password: hashed,
        createdAt: new Date()
    });

    res.status(201).json({ message: "User created" });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    const db = await connectDB();
    const user = await db.collection("users").findOne({ username });

    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id;
    req.session.username = user.username;

    res.status(200).json({ message: "Login successful" });
});

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("sid");
        res.json({ message: "Logged out" });
    });
});

module.exports = router;
