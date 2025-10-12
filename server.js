// import express from "express";
// import dotenvFlow from "dotenv-flow";
// import cors from "cors";

// import connectDB from  "./config/db.js"; // ✅ DB connection helper
// import electricRoutes from "./routes/electric.routes.js";
// import loginRoutes from "./routes/login.routes.js"; // ✅ NEW

// // ✅ Load env files depending on NODE_ENV
// dotenvFlow.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ API Routes
// //app.use("/api/electric", electricRoutes);
// app.use("/electric", electricRoutes);
// //app.use("/auth", electricRoutes);
// app.use("/auth", loginRoutes); // ✅ NEW route for login

// // ✅ Root health check
// app.get("/", (req, res) => {
//   res.send("⚡ Electricity Management API is running...");
// });

// // ✅ Connect to DB and start server
// const startServer = async () => {
//   await connectDB(); // calls db.js
//   app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// };

// startServer();

import express from "express";
import dotenvFlow from "dotenv-flow";
import cors from "cors";

import connectDB from "./config/db.js"; // ✅ DB connection helper
import electricRoutes from "./routes/electric.routes.js";
import loginRoutes from "./routes/login.routes.js"; // ✅ Login route

// ✅ Load environment variables
dotenvFlow.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/electric", electricRoutes);
app.use("/auth", loginRoutes);

// ✅ Root health check
app.get("/", (req, res) => {
  res.send("⚡ Electricity Management API is running...");
});

// ✅ Connect to DB once when Vercel initializes
// (Only connect if not already connected)
let isConnected = false;
const ensureDBConnection = async () => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      console.log("✅ MongoDB connected successfully");
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err.message);
    }
  }
};

// ✅ Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await ensureDBConnection();
  next();
});

// ✅ Export the app instead of app.listen()
export default app;
