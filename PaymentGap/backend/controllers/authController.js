import { getUserByUsernameAndPassword, createUser, deleteUserById, updateUserPassword  } from '../models/authModel.js';


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

export async function deleteUser(req, res) {
  const { id_user } = req.params;

  // Check that required parameters are provided
  if (!id_user) {
    return res.status(400).json({ success: false, message: "Missing user ID" });
  }

  try {
    // Attempt to delete the user
    const isDeleted = await deleteUserById(id_user);
    if (isDeleted) {
      // If the user was deleted successfully, return a success message
      return res.json({ success: true, message: "User deleted successfully" });
    } else {
      // If no user was found with the provided ID, return an error
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Error in deleteUser:", err);
    return res.status(500).json({ success: false, message: "Unable to delete user" });
  }
}

export async function resetPassword(req, res) {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  try {
    const isUpdated = await updateUserPassword(username, newPassword);
    if (isUpdated) {
      return res.json({ success: true, message: "Password updated successfully" });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(500).json({ success: false, message: "Unable to reset password" });
  }
}
