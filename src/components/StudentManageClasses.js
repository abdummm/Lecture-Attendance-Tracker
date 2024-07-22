import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { collection, query, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth } from '../firebase/config';

const StudentManageClasses = () => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(firestore, "Classes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableClasses(classes);
    });

    const userRef = doc(firestore, "Users", auth.currentUser.uid);
    const unsubscribeUser = onSnapshot(userRef, (doc) => {
      setJoinedClasses(doc.data().classes || []);
    });

    return () => {
      unsubscribe();
      unsubscribeUser();
    };
  }, []);

  const filteredClasses = availableClasses.filter(classItem =>
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const joinClass = async (classId) => {
    const userId = auth.currentUser.uid;
    
    // Update the user's document with the new classId
    const userRef = doc(firestore, "Users", userId);
    await updateDoc(userRef, {
      classes: arrayUnion(classId),
    });
  
    // Update the class's document to include the user
    const classRef = doc(firestore, "Classes", classId);
    await updateDoc(classRef, {
      students: arrayUnion(userId),
    });
  };

  const leaveClass = async (classId) => {
    const userId = auth.currentUser.uid;
    
    // Update the user's document to remove the classId
    const userRef = doc(firestore, "Users", userId);
    await updateDoc(userRef, {
      classes: arrayRemove(classId),
    });
  
    // Update the class's document to remove the user
    const classRef = doc(firestore, "Classes", classId);
    await updateDoc(classRef, {
      students: arrayRemove(userId),
    });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-16">
      <div className="w-full max-w-md px-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for classes..."
            className="p-2 border rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <h2 className="text-xl font-semibold mb-4">Available Classes</h2>
        {filteredClasses.map((classItem) => (
          <div key={classItem.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-2 shadow">
            <span>{classItem.name}</span>
            {!joinedClasses.includes(classItem.id) && (
              <button onClick={() => joinClass(classItem.id)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                Join Class
              </button>
            )}
          </div>
        ))}
        <h2 className="text-xl font-semibold mb-4">Joined Classes</h2>
        {joinedClasses.map((classId) => {
          const classItem = availableClasses.find(c => c.id === classId);
          return classItem ? (
            <div key={classItem.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-2 shadow">
              <span>{classItem.name}</span>
              <button onClick={() => leaveClass(classItem.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                Leave Class
              </button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default StudentManageClasses;
