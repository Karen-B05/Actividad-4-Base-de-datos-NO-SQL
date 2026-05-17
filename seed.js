/**
 * seed.js — MovieStream MongoDB seed script
 * 
 * Uso:
 *   npm install mongodb
 *   MONGODB_URI=mongodb+srv://... node seed.js
 *   # o con MongoDB local:
 *   node seed.js
 */

const { MongoClient, ObjectId } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "moviestream";

const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Thriller", "Horror", "Romance", "Animation", "Documentary", "Fantasy"];

const movies = [
  { title: "Inception", year: 2010, duration_min: 148, budget_usd: 160000000, gross_usd: 836836967, genres: ["Sci-Fi", "Thriller", "Action"], cast: [{ name: "Leonardo DiCaprio", role: "Dom Cobb" }, { name: "Joseph Gordon-Levitt", role: "Arthur" }], awards: 4, main_subject: "A thief enters dreams to steal secrets" },
  { title: "The Shawshank Redemption", year: 1994, duration_min: 142, budget_usd: 25000000, gross_usd: 58300000, genres: ["Drama"], cast: [{ name: "Tim Robbins", role: "Andy Dufresne" }, { name: "Morgan Freeman", role: "Ellis Boyd 'Red' Redding" }], awards: 7, main_subject: "Hope and friendship in prison" },
  { title: "The Dark Knight", year: 2008, duration_min: 152, budget_usd: 185000000, gross_usd: 1004558444, genres: ["Action", "Thriller"], cast: [{ name: "Christian Bale", role: "Bruce Wayne" }, { name: "Heath Ledger", role: "Joker" }], awards: 8, main_subject: "Batman vs the Joker" },
  { title: "Interstellar", year: 2014, duration_min: 169, budget_usd: 165000000, gross_usd: 701729206, genres: ["Sci-Fi", "Drama"], cast: [{ name: "Matthew McConaughey", role: "Cooper" }, { name: "Anne Hathaway", role: "Brand" }], awards: 5, main_subject: "Astronauts travel through a wormhole" },
  { title: "Parasite", year: 2019, duration_min: 132, budget_usd: 11400000, gross_usd: 263100000, genres: ["Drama", "Thriller"], cast: [{ name: "Song Kang-ho", role: "Ki-taek" }, { name: "Lee Sun-kyun", role: "Park Dong-ik" }], awards: 9, main_subject: "Class warfare in Seoul" },
  { title: "Spirited Away", year: 2001, duration_min: 125, budget_usd: 19000000, gross_usd: 395802204, genres: ["Animation", "Fantasy"], cast: [{ name: "Daveigh Chase", role: "Chihiro (voice)" }], awards: 6, main_subject: "A girl trapped in a spirit world" },
  { title: "The Godfather", year: 1972, duration_min: 175, budget_usd: 6000000, gross_usd: 245066411, genres: ["Drama", "Thriller"], cast: [{ name: "Marlon Brando", role: "Vito Corleone" }, { name: "Al Pacino", role: "Michael Corleone" }], awards: 11, main_subject: "The Corleone crime family" },
  { title: "Pulp Fiction", year: 1994, duration_min: 154, budget_usd: 8000000, gross_usd: 213928762, genres: ["Thriller", "Comedy"], cast: [{ name: "John Travolta", role: "Vincent Vega" }, { name: "Samuel L. Jackson", role: "Jules Winnfield" }], awards: 7, main_subject: "Intertwined crime stories in LA" },
  { title: "The Matrix", year: 1999, duration_min: 136, budget_usd: 63000000, gross_usd: 467222728, genres: ["Sci-Fi", "Action"], cast: [{ name: "Keanu Reeves", role: "Neo" }, { name: "Laurence Fishburne", role: "Morpheus" }], awards: 4, main_subject: "Reality is a simulation" },
  { title: "Forrest Gump", year: 1994, duration_min: 142, budget_usd: 55000000, gross_usd: 678226465, genres: ["Drama", "Comedy", "Romance"], cast: [{ name: "Tom Hanks", role: "Forrest Gump" }, { name: "Robin Wright", role: "Jenny Curran" }], awards: 13, main_subject: "Life of a simple man through US history" },
  { title: "Fight Club", year: 1999, duration_min: 139, budget_usd: 63000000, gross_usd: 101218804, genres: ["Thriller", "Drama"], cast: [{ name: "Brad Pitt", role: "Tyler Durden" }, { name: "Edward Norton", role: "The Narrator" }], awards: 3, main_subject: "An underground fight club as rebellion" },
  { title: "The Silence of the Lambs", year: 1991, duration_min: 118, budget_usd: 19000000, gross_usd: 272742922, genres: ["Thriller", "Horror"], cast: [{ name: "Jodie Foster", role: "Clarice Starling" }, { name: "Anthony Hopkins", role: "Hannibal Lecter" }], awards: 12, main_subject: "FBI agent seeks a serial killer's help" },
  { title: "Goodfellas", year: 1990, duration_min: 146, budget_usd: 25000000, gross_usd: 46836394, genres: ["Drama", "Thriller"], cast: [{ name: "Ray Liotta", role: "Henry Hill" }, { name: "Robert De Niro", role: "James Conway" }], awards: 6, main_subject: "Rise and fall of a mob associate" },
  { title: "The Lion King", year: 1994, duration_min: 88, budget_usd: 45000000, gross_usd: 763455561, genres: ["Animation", "Drama", "Fantasy"], cast: [{ name: "Matthew Broderick", role: "Simba (voice)" }, { name: "Jeremy Irons", role: "Scar (voice)" }], awards: 5, main_subject: "A lion cub reclaims his kingdom" },
  { title: "Schindler's List", year: 1993, duration_min: 195, budget_usd: 22000000, gross_usd: 321365567, genres: ["Drama", "Documentary"], cast: [{ name: "Liam Neeson", role: "Oskar Schindler" }, { name: "Ben Kingsley", role: "Itzhak Stern" }], awards: 15, main_subject: "A businessman saves Jewish lives in WWII" },
  { title: "Eternal Sunshine of the Spotless Mind", year: 2004, duration_min: 108, budget_usd: 20000000, gross_usd: 72258126, genres: ["Romance", "Sci-Fi", "Drama"], cast: [{ name: "Jim Carrey", role: "Joel Barish" }, { name: "Kate Winslet", role: "Clementine Kruczynski" }], awards: 3, main_subject: "Erasing a failed relationship from memory" },
  { title: "No Country for Old Men", year: 2007, duration_min: 122, budget_usd: 25000000, gross_usd: 171627166, genres: ["Thriller", "Drama"], cast: [{ name: "Josh Brolin", role: "Llewelyn Moss" }, { name: "Javier Bardem", role: "Anton Chigurh" }], awards: 8, main_subject: "A hitman pursues a man with stolen money" },
  { title: "Whiplash", year: 2014, duration_min: 107, budget_usd: 3300000, gross_usd: 49000000, genres: ["Drama"], cast: [{ name: "Miles Teller", role: "Andrew Neiman" }, { name: "J.K. Simmons", role: "Terence Fletcher" }], awards: 5, main_subject: "A drumming student pushed to his limits" },
  { title: "Get Out", year: 2017, duration_min: 104, budget_usd: 4500000, gross_usd: 255459062, genres: ["Horror", "Thriller"], cast: [{ name: "Daniel Kaluuya", role: "Chris Washington" }, { name: "Allison Williams", role: "Rose Armitage" }], awards: 4, main_subject: "A Black man visits his white girlfriend's family" },
  { title: "Everything Everywhere All at Once", year: 2022, duration_min: 139, budget_usd: 14300000, gross_usd: 103900000, genres: ["Sci-Fi", "Comedy", "Action"], cast: [{ name: "Michelle Yeoh", role: "Evelyn Wang" }, { name: "Ke Huy Quan", role: "Waymond Wang" }], awards: 10, main_subject: "A woman explores parallel universes" }
];

const users = [
  { username: "cinemaniac88", email: "cine@example.com", country: "MX", subscription: "premium", registered_at: new Date("2023-01-15") },
  { username: "movie_buff_99", email: "buff@example.com", country: "US", subscription: "basic", registered_at: new Date("2022-06-01") },
  { username: "popcorn_queen", email: "popcorn@example.com", country: "MX", subscription: "premium", registered_at: new Date("2023-03-20") },
  { username: "filmnerd42", email: "nerd@example.com", country: "AR", subscription: "basic", registered_at: new Date("2021-11-10") },
  { username: "scifi_lover", email: "scifi@example.com", country: "MX", subscription: "premium", registered_at: new Date("2023-08-05") },
  { username: "horrorjunkie", email: "horror@example.com", country: "CO", subscription: "basic", registered_at: new Date("2022-02-14") },
  { username: "dramaqueen2k", email: "drama@example.com", country: "ES", subscription: "premium", registered_at: new Date("2023-05-30") },
  { username: "actionhero_mx", email: "action@example.com", country: "MX", subscription: "basic", registered_at: new Date("2022-09-12") },
  { username: "indie_soul", email: "indie@example.com", country: "CL", subscription: "premium", registered_at: new Date("2023-07-18") },
  { username: "marathoner_pro", email: "marathon@example.com", country: "MX", subscription: "premium", registered_at: new Date("2021-12-25") }
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");

    const db = client.db(DB_NAME);

    // Drop existing collections
    await db.collection("movies").drop().catch(() => {});
    await db.collection("users").drop().catch(() => {});
    await db.collection("interactions").drop().catch(() => {});

    // Insert movies
    const moviesResult = await db.collection("movies").insertMany(movies);
    const movieIds = Object.values(moviesResult.insertedIds);
    console.log(`🎬 ${movieIds.length} películas insertadas`);

    // Insert users
    const usersResult = await db.collection("users").insertMany(users);
    const userIds = Object.values(usersResult.insertedIds);
    console.log(`👥 ${userIds.length} usuarios insertados`);

    // Generate interactions
    const interactions = [];
    const types = ["view", "rating", "view", "view"]; // more views than ratings
    for (let i = 0; i < 50; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const movieId = movieIds[Math.floor(Math.random() * movieIds.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      interactions.push({
        userId,
        movieId,
        type,
        rating: type === "rating" ? Math.round((Math.random() * 4 + 1) * 2) / 2 : null,
        watched_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        completed: Math.random() > 0.3
      });
    }
    await db.collection("interactions").insertMany(interactions);
    console.log(`⭐ ${interactions.length} interacciones insertadas`);

    // Create indexes
    await db.collection("movies").createIndex({ genres: 1 });
    await db.collection("movies").createIndex({ title: "text" });
    await db.collection("interactions").createIndex({ userId: 1 });
    await db.collection("interactions").createIndex({ movieId: 1 });
    console.log("📇 Índices creados");

    console.log("\n✅ Base de datos lista en:", DB_NAME);
  } finally {
    await client.close();
  }
}

seed().catch(console.error);