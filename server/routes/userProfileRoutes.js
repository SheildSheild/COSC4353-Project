import express from 'express';
// import db from '../mongoConnect.js';
import connectToDatabase from '../mongoConnect.js'; // Commented out due to differences in mongoConnect.js

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
  const collection = db.collection("users");
  const { userId } = req.params;
  let user = await collection.find({id: parseInt(userId)})
    .limit(1).toArray();

  if (user) {
    res.status(200).json(user[0]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  const db = await connectToDatabase(); // Commented out due to differences in mongoConnect.js
  const collection = db.collection("users");
  const { userId } = req.params;
  const { _id, ...updatedData } = req.body;

  try {
    const result = await collection.updateOne(
      { id: parseInt(userId) }, // Query to find the user by id
      { $set: updatedData } // Update operation
    );

    if (result.matchedCount > 0) {
      // Fetch the updated user to send back as response
      const updatedUser = await collection.findOne({ id: parseInt(userId) });
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'An error occurred while updating the user' });
  }
});

export default router;