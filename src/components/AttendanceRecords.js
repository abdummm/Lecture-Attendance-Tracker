import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase/config'; // Adjust this path as necessary
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebase/config'; // Ensure you have authentication setup
import { UserRoleContext } from '../App';

const AttendanceRecords = () => {
  const [classes, setClasses] = useState([]);
  const userRole = useContext(UserRoleContext);

  useEffect(() => {
    const fetchClasses = async () => {
      let fetchedClasses = [];
      if (userRole === 'professor') {
        const classesQuery = query(collection(firestore, "Classes"), where("professorId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(classesQuery);
        fetchedClasses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name, // Assuming 'name' is the field for the class name
        }));
      } else {
        const studentId = auth.currentUser.uid;
        const classesQuery = query(collection(firestore, "Classes"), where("students", "array-contains", studentId));
        const querySnapshot = await getDocs(classesQuery);
        fetchedClasses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
      }
      
      setClasses(fetchedClasses); // Update state with the fetched classes
    };

    fetchClasses().catch(console.error);
  }, [userRole]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <h1 className="text-xl font-semibold mb-4">Attendance Records</h1>
      <div className="w-full max-w-md flex flex-col items-center">
        {classes.map((classItem) => (
          <Link to={`/attendance/${classItem.id}`} key={classItem.id} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 my-2 w-full text-center">
            {classItem.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AttendanceRecords;
