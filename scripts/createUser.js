import mongoose from "mongoose";
import bcrypt from "bcrypt";
import readline from "readline";
import User from "../models/user.model.js"; // adjust the path if needed
//node scripts/createUser.js

// ✅ MongoDB connection
const mongoURI = "mongodb+srv://User1:user1@records.thxeqbd.mongodb.net/?retryWrites=true&w=majority&appName=Records";
//const mongoURI = "mongodb://127.0.0.1:27017/yourDatabaseName"; // replace with your DB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Read command line inputs
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createUser = async () => {
  try {
    const username = await question("Enter username: ");
    const password = await question("Enter password: ");
    const role = await question("Enter role: ");

    // hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();
    console.log(`✅ User '${username}' created successfully!`);
  } catch (error) {
    console.error("❌ Error creating user:", error);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
};

createUser();