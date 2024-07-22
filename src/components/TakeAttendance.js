import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../firebase/config'; // Adjust this path as necessary
import { collection, doc, setDoc, query, where, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase/config'; // Ensure you have authentication setup

const TakeAttendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [attendanceSessionName, setAttendanceSessionName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Set the default attendance session name with the current date and time
        const currentDate = new Date().toLocaleString();
        // Remove any commas from currentDate to avoid CSV issues
        const formattedDate = currentDate.replace(/,/g, '');
        setAttendanceSessionName(`Attendance ${formattedDate}`);

        // Fetch the current user's classes
        const professorId = auth.currentUser.uid;
        const classesQuery = query(collection(firestore, "Classes"), where("professorId", "==", professorId));

        const unsubscribe = onSnapshot(classesQuery, (querySnapshot) => {
            const fetchedClasses = querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setClasses(fetchedClasses);
        });

        return () => unsubscribe(); // Detach listener on unmount
    }, []);

    const handleClassSelection = (classId) => {
        setSelectedClassId(classId);
    };

const handleTakeAttendance = async () => {
    if (selectedClassId) {
        // Create a new document for the attendance session
        const attendanceSessionRef = doc(collection(firestore, "Classes", selectedClassId, "attendance"));
        try {
            await setDoc(attendanceSessionRef, {
                name: attendanceSessionName,
                timestamp: new Date(),
                attended: [],
            });
            console.log('Attendance session created with ID:', attendanceSessionRef.id);
            // Proceed to show QR code or the attendance interface
            // Update the navigate path to include attendance session ID
            navigate(`/display-qr/${selectedClassId}/${attendanceSessionRef.id}`);
        } catch (error) {
            console.error('Error creating attendance session:', error);
            alert('There was an error creating the attendance session.');
        }
    }
};

    return (
        <div className="flex flex-col items-center w-full pt-16">
            <h1 className="text-xl font-semibold mb-4">Select a Class for Attendance</h1>
            <div className="w-full max-w-md flex flex-col items-center">
                {classes.map((classItem) => (
                    <button
                        key={classItem.id}
                        onClick={() => handleClassSelection(classItem.id)}
                        className={`w-full text-left px-4 py-2 rounded my-2 
                                    ${selectedClassId === classItem.id ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        {classItem.name}
                    </button>
                ))}
                <input
                    type="text"
                    value={attendanceSessionName}
                    onChange={(e) => setAttendanceSessionName(e.target.value)}
                    className="w-full max-w-md mt-4 px-4 py-2 border rounded"
                    placeholder="Please name the attendance session"
                />
            </div>
            <button
                type="button"
                onClick={handleTakeAttendance}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full max-w-md"
                disabled={!selectedClassId}
            >
                Take Attendance
            </button>
        </div>
    );
};

export default TakeAttendance;
