import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const star = {
    name: "Sol",
    coordinates: { x: 0, y: 0, z: 0 },
    radius: 0.1
};

const planet = {
    name: "Sol",
    coordinates: { x: 1, y: 1, z: 1 },
    radius: 0.1
};

// API endpoint to fetch the star
app.get("/", (req, res) => {
    res.json([star]);
});
app.get("/star", (req, res) => {
    res.json([star, planet]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));