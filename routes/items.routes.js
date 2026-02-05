const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../database/mongo");
const auth = require("../middleware/auth");

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

router.post("/", auth, async (req, res) => {
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

router.put("/:id", auth, async (req, res) => {
    try {
        const allowedFields = [
            "fullName",
            "city",
            "position",
            "company",
            "email",
            "graduationYear"
        ];

        const updateData = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        const db = await connectDB();
        const result = await db.collection("alumni").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateData }
        );

        if (!result.matchedCount) {
            return res.status(404).json({ error: "Alumni not found" });
        }

        res.status(200).json({ message: "Updated successfully" });
    } catch {
        res.status(400).json({ error: "Invalid ID" });
    }
});

router.delete("/:id", auth, async (req, res) => {
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
