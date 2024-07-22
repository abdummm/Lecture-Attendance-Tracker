import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase/config';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";

const Settings = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentEmployeeNumber, setStudentEmployeeNumber] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(firestore, "Users", user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setEmail(userData.email);
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                    setStudentEmployeeNumber(userData.idNumber);
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const user = auth.currentUser;

        try {
            if (user && email !== user.email) {
                await updateEmail(user, email);
            }

            if (password.length >= 6) {
                await updatePassword(user, password);
            }

            if (user) {
                const userRef = doc(firestore, "Users", user.uid);
                await updateDoc(userRef, {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    idNumber: studentEmployeeNumber,
                });
            }

            alert('Settings updated successfully!');
        } catch (error) {
            console.error("Error updating settings:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="pt-8 px-4">
            <div className="flex flex-col items-center w-full max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-6">Settings</h1>
                <div className="bg-white w-full rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="studentEmployeeNumber" className="block text-sm font-medium text-gray-700">Student/Employee Number</label>
                            <input
                                type="text"
                                id="studentEmployeeNumber"
                                value={studentEmployeeNumber}
                                onChange={(e) => setStudentEmployeeNumber(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded shadow-sm"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            Update Settings
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
