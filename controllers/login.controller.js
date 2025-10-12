// import bcrypt from "bcrypt";
// import User from "../models/user.model.js"; // ✅ user model

// /**
//  * Login Controller
//  * Expects: { username, password }
//  * Returns: { success: true } or { success: false }
//  */
// export const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // check if user exists
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.json({ success: false });
//     }

//     // log db stored hashed password for comparison
//     console.log("🗄️ Stored hashed password:", user.password);

//     // check password with bcrypt
//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log("✅ Password match result:", isMatch);
//     if (!isMatch) {
//       return res.json({ success: false });
//     }

//     // login success
//     return res.json({ success: true });
//   } catch (error) {
//     console.error("❌ Login error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

//######################################################################################

// import bcrypt from "bcrypt";
// import User from "../models/user.model.js"; // ✅ user model

// /**
//  * Login Controller
//  * Expects: { username, password }
//  * Returns: { success: true } or { success: false }
//  */
// export const loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // 📝 Debug log: incoming credentials (⚠️ Don't use in production!)
//     console.log("🔑 Frontend sent password:", password);

//     // check if user exists
//     const user = await User.findOne({ username });
//     if (!user) {
//       console.log("❌ No user found for username:", username);
//       return res.json({ success: "error" });
//     }

//     // log db stored hashed password for comparison
//     console.log("🗄️ Stored hashed password:", user.password);

//     // check password with bcrypt
//     // const isMatch = await bcrypt.compare(password, user.password);
//     // console.log("✅ Password match result:", isMatch);

//     // if (!isMatch) {
//     //   return res.json({ success: false });
//     // }

//     // // login success
//     // return res.json({ success: true });
//     // ❌ Not secure, only for testing/demo
// if (password === user.password) {
//   console.log("Password matches");
//   return res.json({ success: user.role });
// } else {
//   console.log("Password does not match");
//   return res.json({ success: "error" });
// }

//   } catch (error) {
//     console.error("❌ Login error:", error);
//     return res.status(500).json({ success: "error", message: "Server error" });
//   }
// };


import bcrypt from "bcrypt";
import User from "../models/user.model.js"; // ✅ user model

/**
 * Login Controller
 * Expects: { username, password }
 * Returns: { success: role } or { success: "error" }
 */
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ No user found for username:", username);
      return res.json({ success: "error" });
    }

    // log db stored hashed password (for debugging; remove in production)
    console.log("🗄️ Stored hashed password:", user.password);

    // ✅ Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password match result:", isMatch);

    if (!isMatch) {
      return res.json({ success: "error" });
    }

    // login success: return user's role
    return res.json({ success: user.role });

  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ success: "error", message: "Server error" });
  }
};
