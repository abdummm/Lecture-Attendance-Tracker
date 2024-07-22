import { auth, firestore } from './config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import these for Firestore operations

/**
 * Registers a new user (professor or student) and adds their details to Firestore.
 */
export const registerUser = async (email, password, role, idNumber, firstName, lastName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Add additional user info to Firestore
    await setDoc(doc(firestore, "Users", user.uid), {
      email,
      role,
      idNumber, // Employee number for professor, Student number for student
      firstName, // Store first name
      lastName,  // Store last name
      classes: [] // Initialize with empty array
    });
    return user;
  } catch (error) {
    console.error("Error registering new user:", error);
    throw error;
  }
};

/**
 * Logs in a user.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Logs out the current user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
