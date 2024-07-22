import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { firestore } from '../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const DisplayQRCode = () => {
    const { classId, attendanceSessionId } = useParams();
    const [qrCodes, setQrCodes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionCompleted, setSessionCompleted] = useState(false);
    const displayInterval = 10000; // Display each QR code for 10 seconds
    

    useEffect(() => {
        const currentTime = Date.now();
        const generateQRCodes = () => {
            // Generate 10 QR codes for this example
            return Array.from({ length: 10 }, (_, index) => ({
                token: `${classId}-${currentTime}-${index}`,
                validUntil: currentTime + displayInterval * (index + 1), // Set validity period
            }));
        };

        const qrCodes = generateQRCodes();
        setQrCodes(qrCodes);

        // Store in a single Firestore document
        const sessionDocRef = doc(firestore, "QRCodeSessions", `session-${classId}-${currentTime}`);
        setDoc(sessionDocRef, {
            classId: classId,
            AttendanceSessionId: attendanceSessionId,
            tokens: qrCodes.map(qrCode => ({ token: qrCode.token, validUntil: qrCode.validUntil })),
            createdAt: serverTimestamp(),
        }).catch(error => console.error("Error writing document: ", error));

        // Update the displayed QR code at set intervals
        const intervalId = setInterval(() => {
            setCurrentIndex(currentIndex => {
                if (currentIndex < qrCodes.length - 1) {
                    return currentIndex + 1;
                } else {
                    clearInterval(intervalId); // Stop cycling through QR codes
                    setSessionCompleted(true); // Indicate session completion
                    return currentIndex; // Keep the last index to prevent further updates
                }
            });
        }, displayInterval);

        return () => clearInterval(intervalId);
    }, [classId, attendanceSessionId]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {sessionCompleted ? (
                <h2>Attendance Complete</h2>
            ) : (
                <>
                    <h2>Scan QR Code for Attendance</h2>
                    {qrCodes.length > 0 ? (
                        <QRCode
                            value={qrCodes[currentIndex].token}
                            size={256}
                            level="H"
                            includeMargin={true}
                        />
                    ) : (
                        <p>Loading QR codes...</p>
                    )}
                    <p>QR Code {currentIndex + 1} of {qrCodes.length}</p>
                </>
            )}
        </div>
    );
};

export default DisplayQRCode;
