import express from "express";
import dotenvFlow from "dotenv-flow";
import cors from "cors";

import connectDB from  "./config/db.js"; // ✅ DB connection helper
import electricRoutes from "./routes/electric.routes.js";
import loginRoutes from "./routes/login.routes.js"; // ✅ NEW

// ✅ Load env files depending on NODE_ENV
dotenvFlow.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
//app.use("/api/electric", electricRoutes);
app.use("/electric", electricRoutes);
//app.use("/auth", electricRoutes);
app.use("/auth", loginRoutes); // ✅ NEW route for login

// ✅ Root health check
app.get("/", (req, res) => {
  res.send("⚡ Electricity Management API is running...");
});

// ✅ Connect to DB and start server
const startServer = async () => {
  await connectDB(); // calls db.js
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
