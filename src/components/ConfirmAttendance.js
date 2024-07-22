import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase/config';
import { collection, query, where, getDocs, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../firebase/config';

const ConfirmAttendance = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateTokenAndRecordAttendance = async () => {
      try {
        const tokensRef = collection(firestore, "QRCodeTokens");
        const q = query(tokensRef, where("token", "==", token));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const tokenDoc = querySnapshot.docs[0];
          const tokenData = tokenDoc.data();
          const now = new Date();

          if (tokenData.validUntil.toDate() > now) {
            const classId = tokenData.classId;
            const studentId = auth.currentUser.uid;

            const attendanceRef = doc(firestore, "ClassAttendance", classId);
            await updateDoc(attendanceRef, {
              attendees: arrayUnion(studentId),
              lastUpdated: serverTimestamp(),
            });

            setIsValidToken(true);
          }
        }
      } catch (error) {
        console.error("Failed to validate token or record attendance", error);
        // Handle error appropriately (e.g., set error state, show error message)
      } finally {
        setLoading(false);
      }
    };

    validateTokenAndRecordAttendance();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (!isValidToken) return <div>Invalid or Expired Token.</div>;

  return (
    <div>
      <h1>Attendance Confirmed!</h1>
      <button onClick={() => navigate('/')}>Go to Dashboard</button>
    </div>
  );
};

export default ConfirmAttendance;
