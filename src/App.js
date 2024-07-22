import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, firestore } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import TakeAttendance from './components/TakeAttendance';
import DisplayQRCode from './components/DisplayQRCode';
import ProfessorManageClasses from './components/ProfessorManageClasses';
import StudentManageClasses from './components/StudentManageClasses';
import Settings from './components/Settings';
import AttendanceRecords from './components/AttendanceRecords';
import ClassAttendanceDetails from './components/ClassAttendanceDetails';
import ConfirmAttendance from './components/ConfirmAttendance';
import ScanQR from './components/ScanQR';

export const UserRoleContext = createContext();

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const userRef = doc(firestore, "Users", user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUserRole(userData.role);
                }
            } else {
                setCurrentUser(null);
                setUserRole('');
            }
            setLoading(false); // Set loading to false once the user and role are determined
        });

        return () => unsubscribe();
    }, []);

    if (loading) { // Conditional rendering based on the loading state
        return <div>Loading...</div>; // Placeholder loading content, customize as needed
    }

    return (
        <UserRoleContext.Provider value={userRole}>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to={currentUser ? (userRole === 'professor' ? "/take-attendance" : "/attendance-records") : "/login"} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/take-attendance" element={currentUser && userRole === 'professor' ? <Layout><TakeAttendance /></Layout> : <Navigate to="/login" />} />
                    <Route path="/display-qr/:classId/:attendanceSessionId" element={currentUser && userRole === 'professor' ? <Layout><DisplayQRCode /></Layout> : <Navigate to="/login" />} />
                    <Route path="/manage-classes" element={currentUser ? <Layout>{userRole === 'professor' ? <ProfessorManageClasses /> : <StudentManageClasses />}</Layout> : <Navigate to="/login" />} />
                    <Route path="/scanQR" element={currentUser ? <Layout>{userRole === 'student' ? <ScanQR /> : <p>You do not have access to this page.</p>}</Layout> : <Navigate to="/login" />} />
                    <Route path="/settings" element={currentUser ? <Layout><Settings /></Layout> : <Navigate to="/login" />} />
                    <Route path="/attendance-records" element={currentUser ? <Layout><AttendanceRecords /></Layout> : <Navigate to="/login" />} />
                    <Route path="/attendance/:classId" element={currentUser ? <Layout><ClassAttendanceDetails /></Layout> : <Navigate to="/login" />} />
                    <Route path="/confirm-attendance/:token" element={<ConfirmAttendance />} />
                </Routes>
            </Router>
        </UserRoleContext.Provider>
    );
}

export default App;
