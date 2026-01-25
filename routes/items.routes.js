const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../database/mongo");

const router = express.Router();
const COLLECTION = "items";

router.get("/", async (req, res) => {
    try {
        const db = await connectDB();

        const filter = {};
        if (req.query.title) {
            filter.title = req.query.title;
        }

        const sort = {};
        if (req.query.sortBy) {
            sort[req.query.sortBy] =
                req.query.order === "desc" ? -1 : 1;
        }

        const projection = {};
        if (req.query.fields) {
            req.query.fields.split(",").forEach(f => {
                projection[f] = 1;
            });
        }

        const items = await db
            .collection(COLLECTION)
            .find(filter)
            .project(projection)
            .sort(sort)
            .toArray();

        res.status(200).json(items);
    } catch {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const db = await connectDB();
        const item = await db.collection(COLLECTION).findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!item)
            return res.status(404).json({ error: "Item not found" });

        res.status(200).json(item);
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
});

router.post("/", async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description)
        return res.status(400).json({ error: "Missing fields" });

    try {
        const db = await connectDB();
        const result = await db.collection(COLLECTION).insertOne({
            title,
            description,
            created_at: new Date()
        });

        res.status(201).json(result);
    } catch {
        res.status(500).json({ error: "Database error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.collection(COLLECTION).updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );

        if (!result.matchedCount)
            return res.status(404).json({ error: "Item not found" });

        res.status(200).json({ message: "Updated" });
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.collection(COLLECTION).deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (!result.deletedCount)
            return res.status(404).json({ error: "Item not found" });

        res.status(200).json({ message: "Deleted" });
    } catch {
        res.status(400).json({ error: "Invalid id" });
    }
});

module.exports = router;
