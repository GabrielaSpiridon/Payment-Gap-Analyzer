// Import the necessary functions from the user model.
import { getUserByUsernameAndPassword, createUser } from '../models/userModel.js';

/**
 * Handle user login.
 * Expects `req.body` to contain `username` and `password`.
 * If the user exists and the credentials match, return the user ID.
 * Otherwise, return a 404 with "unknown user".
 */
export async function login(req, res) {
  const { username, password} = req.body;

  // Check that required parameters are provided
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  // Query the database for the user
  const user = await getUserByUsernameAndPassword(username, password);
  if (user) {
    // If user is found, return success with the user ID
    return res.json({ success: true, userId: user.id_user });
  } else {
    // If no user is found, return an error response
    return res.status(404).json({ success: false, message: "Unknown user" });
  }
}

/**
 * Handle user registration.
 * Expects `req.body` to contain `username`, `password`, and `role`.
 * Attempts to create a new user in the database and returns the new user's ID if successful.
 * On error, returns a 500 with "unable to create user".
 */
export async function register(req, res) {
  const { username, password, role} = req.body;

  // Check that required parameters are provided
  if (!username || !password || !role) {
    return res.status(400).send("Missing parameters");
  }

  // In a real application, consider hashing the password before storing

  const userId = await createUser(username, password, role);
  if (userId) {
    // User successfully created; return the new user's ID
    res.json({ userId: Number(userId) });
  } else {
    // If something went wrong (e.g., duplicate email), return an error
    return res.status(500).send("unable to create user");
  }
}
