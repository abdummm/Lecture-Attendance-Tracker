// src/firebase/firestore.js
import { firestore } from './config';

/**
 * Fetches user data from Firestore.
 */
export const getUserData = async (userId) => {
  try {
    const doc = await firestore.collection('Users').doc(userId).get();
    if (doc.exists) {
      return doc.data();
    } else {
      console.error("No such user!");
      return null; // or handle as needed
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

// Add more Firestore interactions as needed
