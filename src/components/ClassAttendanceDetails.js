import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase/config';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { UserRoleContext } from '../App';
import { auth } from '../firebase/config'; // Ensure you have authentication setup


const fetchAttendanceRecords = async (classId, userEmail, userRole) => {
  const attendanceRecords = {
    name: "Unknown Class",
    lectures: [],
    records: [],
  };

  try {
    const classDocRef = doc(firestore, "Classes", classId);
    const classDocSnap = await getDoc(classDocRef);

    if (classDocSnap.exists()) {
      const classData = classDocSnap.data();
      attendanceRecords.name = classData.name;
      if (userRole ==='student') {
        // Fetch only the logged-in student's attendance record
        const studentAttendanceQuery = collection(firestore, "Classes", classId, "attendance");
        const attendanceSnapshot = await getDocs(studentAttendanceQuery);
    
        let lectures = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || `Lecture ${doc.id}`,
          timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().getTime() : null,
          attended: doc.data().attended || [],
        }));
        lectures.sort((a, b) => a.timestamp - b.timestamp);

        attendanceRecords.lectures = lectures.map(({ id, name }) => ({ id, name }));

        const studentsQuery = query(collection(firestore, "Users"), where('classes', 'array-contains', classId));
        const studentsSnapshot = await getDocs(studentsQuery);

        studentsSnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.email === userEmail) {
            const totalClasses = lectures.length;
            const attendedCount = lectures.filter(lecture => lecture.attended.includes(doc.id)).length;
            const attendancePercentage = (attendedCount / totalClasses * 100).toFixed(2) + '%';
            const studentRecord = {
              studentId: userData.idNumber,
              firstName: userData.firstName,
              lastName: userData.lastName,
              attendanceRatio: `${attendedCount}/${totalClasses}`,
              attendancePercentage,
              attendance: lectures.reduce((acc, lecture) => {
                acc[lecture.id] = lecture.attended.includes(doc.id) ? "Attended" : "Not Attended";
                return acc;
              }, {}),
            };
            attendanceRecords.records.push(studentRecord);
          }
        });
      }else if (userRole === 'professor') {
        // Fetch all students' attendance records

        const attendanceCollectionRef = collection(firestore, "Classes", classId, "attendance");
        const attendanceSnapshot = await getDocs(attendanceCollectionRef);

        let lectures = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || `Lecture ${doc.id}`,
          timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().getTime() : null,
          attended: doc.data().attended || [],
        }));

        lectures.sort((a, b) => a.timestamp - b.timestamp);

        attendanceRecords.lectures = lectures.map(({ id, name }) => ({ id, name }));

        const studentsQuery = query(collection(firestore, "Users"), where('classes', 'array-contains', classId));
        const studentsSnapshot = await getDocs(studentsQuery);

        studentsSnapshot.forEach((doc) => {
          const userData = doc.data();
          const totalClasses = lectures.length;
          const attendedCount = lectures.filter(lecture => lecture.attended.includes(doc.id)).length;
          const attendancePercentage = (attendedCount / totalClasses * 100).toFixed(2) + '%';
          const studentRecord = {
            studentId: userData.idNumber,
            firstName: userData.firstName,
            lastName: userData.lastName,
            attendanceRatio: `${attendedCount}/${totalClasses}`,
            attendancePercentage,
            attendance: lectures.reduce((acc, lecture) => {
              acc[lecture.id] = lecture.attended.includes(doc.id) ? "Attended" : "Not Attended";
              return acc;
            }, {}),
          };
          attendanceRecords.records.push(studentRecord);
        });
      }
    }
  } catch (error) {
    console.error("Error fetching attendance records:", error);
  }

  return attendanceRecords;
};

const generateCSV = (attendanceRecords) => {
  const columns = [
    "First Name", "Last Name", "Student Number", "Classes Attended/Total Classes", "Attendance Percentage",
    ...attendanceRecords.lectures.map(lecture => lecture.name)
  ];
  const rows = attendanceRecords.records.map(record => [
    record.firstName,
    record.lastName,
    record.studentId,
    record.attendanceRatio,
    record.attendancePercentage,
    ...attendanceRecords.lectures.map(lecture => record.attendance[lecture.id])
  ]);

  const csvContent = [
    columns.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance-${attendanceRecords.name.replace(/ /g, '_')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const ClassAttendanceDetails = () => {
  let { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const userRole = useContext(UserRoleContext);
  const userEmail = auth.currentUser.email;


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAttendanceRecords(classId, userEmail, userRole);
      setClassDetails(data);
    };

    fetchData().catch(console.error);
  }, [classId, userEmail, userRole]);

  const handleDownloadCSV = () => {
    generateCSV(classDetails);
  };

  if (!classDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-20">
      <h1 className="text-xl font-semibold mb-4">Attendance for {classDetails.name}</h1>
      <button
        onClick={handleDownloadCSV}
        className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Download as CSV
      </button>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Student Number</th>
              <th className="px-4 py-2">Classes Attended/Total Classes</th>
              <th className="px-4 py-2">Attendance Percentage</th>
              {classDetails.lectures.map((lecture) => (
                <th key={lecture.id} className="px-4 py-2">{lecture.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classDetails.records.map((record, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{record.firstName}</td>
                <td className="border px-4 py-2">{record.lastName}</td>
                <td className="border px-4 py-2">{record.studentId}</td>
                <td className="border px-4 py-2">{record.attendanceRatio}</td>
                <td className="border px-4 py-2">{record.attendancePercentage}</td>
                {classDetails.lectures.map((lecture) => (
                  <td key={lecture.id} className="border px-4 py-2">{record.attendance[lecture.id]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassAttendanceDetails;
