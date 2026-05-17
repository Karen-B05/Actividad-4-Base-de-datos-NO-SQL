const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ── DB CONNECTION ──────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "moviestream";

let db;

async function connectDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("✅ Conectado a MongoDB:", DB_NAME);
}

// ── MOVIES ─────────────────────────────────────────────────────

// GET /api/movies?search=&genre=
app.get("/api/movies", async (req, res) => {
  try {
    const { search, genre } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { main_subject: { $regex: search, $options: "i" } },
      ];
    }
    if (genre) {
      filter.genres = genre;
    }

    const movies = await db.collection("movies").find(filter).toArray();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/movies/genres  — lista de géneros únicos
app.get("/api/movies/genres", async (req, res) => {
  try {
    const genres = await db.collection("movies").distinct("genres");
    res.json(genres.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/movies
app.post("/api/movies", async (req, res) => {
  try {
    const doc = req.body;
    const result = await db.collection("movies").insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/movies/:id
app.put("/api/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, ...doc } = req.body; // strip _id if sent
    await db
      .collection("movies")
      .updateOne({ _id: new ObjectId(id) }, { $set: doc });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/movies/:id  — cascade delete interactions
app.delete("/api/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("movies").deleteOne({ _id: new ObjectId(id) });
    await db
      .collection("interactions")
      .deleteMany({ movieId: new ObjectId(id) });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── USERS ──────────────────────────────────────────────────────

// GET /api/users
app.get("/api/users", async (req, res) => {
  try {
    const users = await db.collection("users").find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── INTERACTIONS ───────────────────────────────────────────────

// GET /api/interactions?type=&userId=
app.get("/api/interactions", async (req, res) => {
  try {
    const { type, userId } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (userId) filter.userId = new ObjectId(userId);

    // $lookup para traer título de película y username
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: {
          movieTitle: { $ifNull: [{ $arrayElemAt: ["$movie.title", 0] }, "Película eliminada"] },
          username: { $ifNull: [{ $arrayElemAt: ["$user.username", 0] }, "Usuario desconocido"] },
        },
      },
      { $project: { movie: 0, user: 0 } },
      { $sort: { watched_at: -1 } },
    ];

    const interactions = await db
      .collection("interactions")
      .aggregate(pipeline)
      .toArray();
    res.json(interactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/interactions
app.post("/api/interactions", async (req, res) => {
  try {
    const doc = {
      ...req.body,
      movieId: new ObjectId(req.body.movieId),
      userId: new ObjectId(req.body.userId),
      watched_at: new Date(),
    };
    const result = await db.collection("interactions").insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/interactions/:id
app.put("/api/interactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, movieTitle, username, ...doc } = req.body;
    if (doc.movieId) doc.movieId = new ObjectId(doc.movieId);
    if (doc.userId) doc.userId = new ObjectId(doc.userId);
    await db
      .collection("interactions")
      .updateOne({ _id: new ObjectId(id) }, { $set: doc });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/interactions/:id
app.delete("/api/interactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("interactions").deleteOne({ _id: new ObjectId(id) });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── STATS ──────────────────────────────────────────────────────
app.get("/api/stats", async (req, res) => {
  try {
    const [movies, users, interactions, genres] = await Promise.all([
      db.collection("movies").countDocuments(),
      db.collection("users").countDocuments(),
      db.collection("interactions").countDocuments(),
      db.collection("movies").distinct("genres"),
    ]);
    res.json({ movies, users, interactions, genres: genres.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── START ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🎬 Server en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  });