import React, { useState, useRef, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { auth } from '../firebase/config';
import '../App.css';

const ScanQR = () => {
  const [data, setData] = useState('Scan QR code to mark attendance');
  const scannerRef = useRef(null); // Reference to access scanner methods
  const [scanning, setScanning] = useState(true);
  const [isError, setIsError] = useState(false); // State to track if there is an error



  const handleResult = async (text) => {
    // You would need to check the structure of result if it's not a string
    const currentTime = Date.now();
    if (text) {
      const [classId, randomId, position] = text.split('-');
      const sessionDocId = `session-${classId}-${randomId}`;

      try {
        const sessionDocRef = doc(firestore, 'QRCodeSessions', sessionDocId);
        const sessionDocSnap = await getDoc(sessionDocRef);

        if (sessionDocSnap.exists()) {
          const sessionData = sessionDocSnap.data();
          const correctSession = sessionData.tokens[parseInt(position)];

          if (currentTime <= new Date(correctSession.validUntil).getTime()) {
            const attendanceRef = doc(firestore, 'Classes', classId, 'attendance', sessionData.AttendanceSessionId);
            const userRef = doc(firestore, 'Users', auth.currentUser.uid);
            const userDocSnap = await getDoc(userRef);

            if (!userDocSnap.exists()) {
              setIsError(true);
              setData('User record not found');
              return;
            }

            const userData = userDocSnap.data();

            if (!userData.classes.includes(classId)) {
              setIsError(true);
              setData('You are not enrolled in this class');
              return;
            }
            
            /*
            const attendanceDocSnap = await getDoc(attendanceRef);
            const attendanceData = attendanceDocSnap.data();
            if (attendanceData.attended.includes(studentNumber)) {
              scannerRef.current?.stopScanning();
              setScanning(false);
              setIsError(false);
              setData('Attendance already marked');
              return;
            }*/
            await updateDoc(attendanceRef, {
              attended: arrayUnion(auth.currentUser.uid),
            });
            scannerRef.current?.stopScanning(); // Stop scanning
            setScanning(false);
            setIsError(false);
            setData('Valid QR code scanned and attendance marked');
          } else {
            setIsError(true);
            setData('QR code is invalid or expired');
          }
        } else {
          setIsError(true);
          setData('No matching QR code session found');
        }
      } catch (error) {
        console.error('Error querying the document:', error);
        setIsError(true);
        setData('Error querying the document');
      }
    }
  };

  const handleError = (error) => {
    console.error('Error scanning QR code', error?.message);
    setData(error?.message || 'Error during scanning');
  };

  useEffect(() => {
    const scannerElement = scannerRef.current; // Assign the current scanner reference to a variable
    // Stop scanning when the component unmounts
    return () => {
      if(scannerElement) {
        scannerElement.stopScanning();
      }
    };
  }, []); 

  return (
    <div className="qr-reader-container">
      <p className={`text-center mx-auto ${isError ? 'text-red' : ''}`}>{data}</p>      {scanning && (
      <Scanner
        ref={scannerRef}
        onResult={handleResult}
        onError={handleError}
        enabled={true} // Assuming you want the scanner to be enabled by default
        styles={{
          container: { position: 'relative' },
          video: { width: '100%' }
        }}
        components={{ audio: false }}
      />)}
    </div>
  );
};

export default ScanQR;