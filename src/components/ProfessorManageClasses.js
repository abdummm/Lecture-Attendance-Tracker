import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase/config';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

const AddClassModal = ({ isOpen, onClose, onAdd }) => {
  const [className, setClassName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(className);
    setClassName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-4 rounded-lg shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <label htmlFor="className" className="font-semibold">Class Name:</label>
          <input
            id="className"
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="input border rounded shadow p-2 w-full"
            required
          />
          <div className="flex space-x-2">
            <button type="submit" className="button bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Class</button>
            <button type="button" onClick={onClose} className="button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteClassConfirmation = ({ classToDelete, onConfirmDelete, onCancel }) => {
  const [confirmationName, setConfirmationName] = useState('');

  const handleDelete = () => {
    if (classToDelete.name === confirmationName) {
      onConfirmDelete(classToDelete.id);
    } else {
      alert('Class name does not match. Please enter the correct class name to confirm deletion.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-4 rounded-lg shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <p>Are you sure you want to delete <strong>{classToDelete.name}</strong>? Please confirm by typing the class name below.</p>
          <input
            type="text"
            placeholder="Type class name to confirm"
            value={confirmationName}
            onChange={(e) => setConfirmationName(e.target.value)}
            className="input border rounded shadow p-2 w-full"
            required
          />
          <div className="flex space-x-2">
            <button type="button" onClick={handleDelete} className="button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
            <button type="button" onClick={onCancel} className="button bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfessorManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  useEffect(() => {
    const q = query(collection(firestore, 'Classes'), where('professorId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedClasses = querySnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      setClasses(fetchedClasses);
    });

    return () => unsubscribe();
  }, []);

  const addClass = async (name) => {
    try {
      await addDoc(collection(firestore, 'Classes'), {
        name,
        professorId: auth.currentUser.uid,
        students: [],
      });
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const deleteClass = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'Classes', id));
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const confirmDeleteClass = async (id) => {
    await deleteClass(id);
    setClassToDelete(null); // Reset the deletion confirmation state
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-16">
      <div className="w-full max-w-md px-4 text-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          Add Class
        </button>
        <div className="mb-4">
          <span className="text-lg font-medium">Your Classes</span>
        </div>
        {classes.map((classItem) => (
          <div key={classItem.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-2 shadow">
            <span className="text-lg font-medium">{classItem.name}</span>
            <button
              onClick={() => setClassToDelete(classItem)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Class
            </button>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <AddClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addClass} />
      )}
      {classToDelete && (
        <DeleteClassConfirmation
          classToDelete={classToDelete}
          onConfirmDelete={confirmDeleteClass}
          onCancel={() => setClassToDelete(null)}
        />
      )}
    </div>
  );
};

export default ProfessorManageClasses;