const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

// Test DB connection on startup
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(" Database connection error:", err);
  } else {
    console.log("🕒 Database time:", res.rows[0]);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
const uploadRoutes = require("./routes/upload.routes");
app.use("/api/upload", uploadRoutes);

