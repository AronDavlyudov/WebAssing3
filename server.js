require('dotenv').config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");

const itemsRoutes = require("./routes/items.routes");
const authRoutes = require("./routes/auth.routes"); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/report", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "report.html"));
});

app.get("/idea", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "idea.html"));
});

app.get("/login", (req, res) =>
    res.sendFile(path.join(__dirname, "views/login.html"))
);

app.get("/register", (req, res) =>
    res.sendFile(path.join(__dirname, "views/register.html"))
);

app.get("/auth/me", (req, res) => {
    if (req.session.userId) {
        return res.json({
            authenticated: true,
            username: req.session.username
        });
    }
    res.json({ authenticated: false });
});

app.use("/auth", authRoutes);

app.get("/alumni-crud", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "alumni-card.html"));
});

app.get("/search", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/api/items", itemsRoutes);

app.get("/api/info", (req, res) => {
    res.json({ name: "Daryn Alumni API", version: "2.0", database: "MongoDB" });
});

app.post("/contact", (req, res) => {
    const formData = { ...req.body, date: new Date() };
    fs.appendFileSync("contact_data.json", JSON.stringify(formData) + "\n");
    res.send('<h1>Success!</h1><a href="/">Back</a>');
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});