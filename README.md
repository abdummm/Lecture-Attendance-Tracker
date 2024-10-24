# Lecture Attendance Tracker

## Overview

The **Lecture Attendance Tracker** is a web-based application designed to help professors and instructors track students' attendance during lectures. Built using React, this application automates the process of collecting and managing attendance records, making it easier for academic staff to monitor and analyze students' participation. 

## Features

- **Automated Attendance Recording**: Allows students to check-in during lectures by scanning a qr code that a professer will show.
- **Dynamic QR Code**: The app dynamically updates the QR code every 2 seconds to prevent students from taking a photo and sharing it with those not physically present, ensuring only attendees in the classroom can check in.
- **Dashboard for Professors**: Provides a user-friendly dashboard where instructors can view attendance data, generate reports, and track participation trends. The instructor can also view student specific data.
- **Data Export**: Attendance data can be exported as CSV or Excel files for further analysis or record-keeping.
- **Secure Authentication**: Students and professors authenticate via secure login that we built to ensure data privacy.
- **Mobile Friendly**: Designed to be responsive and accessible from any device, including smartphones and tablets for students and desktops for instructors.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, React
- **Database**: The backend of this poject was a Firebase's NoSQL database for real-time data synchronization and efficient, scalable storage without server management.
- **Cloud Platform**: Hosted on Firebase for scalability and reliability

## Installation

### Prerequisites
- Node.js v14+ installed

### How to Access
The website can be accessed from this link: [classroom-sign-in.web.app](https://classroom-sign-in.web.app/login)

## Usage

1. **Professor Dashboard**: Professors can sign up or log in and create lecture sessions. Each session generates a unique QR code or link that students can use to mark their presence.
2. **Student Check-in**: Students can sign up or log in with their credentials, enter the session code, and mark their attendance.
3. **Attendance Reports**: Professors can view and download reports for each lecture, filter by date, and track students' attendance over time.

## Future Improvements

- Integration with University Systems (LMS)
- An AI-based attendance anomaly detection system uses geolocation and behavioral analytics to ensure students are physically present in the classroom
- Enhanced analytics for student participation

## Contribution

Feel free to fork this repository and submit a pull request. Contributions are welcome to improve features, documentation, and performance
