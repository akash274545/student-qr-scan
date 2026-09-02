<!-- # Student QR Attendance Application

This is the **student-side React application** of the Smart Attendance Management System.

The application allows students to register, log in after teacher approval, scan attendance QR codes, and mark their attendance securely using QR validation and location verification.

## Features

- Student registration
- Student login
- Teacher approval verification
- Password hashing using bcrypt
- QR code scanning using device camera
- Attendance QR token validation
- QR code expiry validation
- Location-based attendance verification
- 100-meter proximity verification
- Prevents duplicate attendance for the same subject on the same day
- Attendance records stored in Firebase Realtime Database
- Student session management using browser local storage
- Responsive user interface

## Technology Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3

### Libraries

- `html5-qrcode` – QR code scanning
- `bcryptjs` – password hashing and verification

### Database

- Firebase Realtime Database

## Application Workflow

```text
Student
   │
   ▼
Student Registration
   │
   ▼
Teacher Approval
   │
   ▼
Student Login
   │
   ▼
QR Scanner
   │
   ▼
QR Token Validation
   │
   ├── Invalid / Expired QR → Attendance Rejected
   │
   ▼
Location Verification
   │
   ├── More than 100 meters → Attendance Rejected
   │
   ▼
Check Duplicate Attendance
   │
   ├── Already Marked → Attendance Rejected
   │
   ▼
Attendance Saved
   │
   ▼
Firebase Realtime Database
QR Attendance Process

When a student scans a QR code:

The application reads the QR code.
The attendance token is extracted from the QR code.
The token is checked against Firebase.
The application verifies that the token is active.
The expiry time of the QR code is checked.
The student's current location is obtained.
The distance between the teacher's location and student's location is calculated.
The student must be within 100 meters of the classroom/teacher location.
The system checks whether attendance has already been marked for that subject on the same day.
If all validations pass, attendance is stored in Firebase.
Firebase Database

The React application communicates with Firebase Realtime Database for:

Student information
Attendance tokens
Subjects
Attendance records

Example database structure:

AttendanceSystem
│
├── users
│   └── student records
│
├── attendanceTokens
│   └── QR attendance tokens
│
├── subjects
│   └── subject information
│
├── attendance
│   └── attendance records
│
├── classes
│
└── defaultSubjects
Project Structure
student-qr-scan/
│
├── public/
│
├── src/
│   ├── App.js
│   ├── App.css
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ScanScreen.js
│   ├── firebase.js
│   ├── index.js
│   └── index.css
│
├
├── package.json
├── package-lock.json
└── README.md
Available Scripts
npm start

Runs the application in development mode.

Open:

http://localhost:3000

The application automatically reloads when source files are modified.

npm run build

Creates an optimized production build in the build directory.

npm run build
npm test

Runs the available tests.

npm test
Installation

Clone the repository:

git clone https://github.com/akash274545/student-qr-scan.git

Move into the project directory:

cd student-qr-scan

Install dependencies:

npm install

Start the application:

npm start
Production Build

To create the production version:

npm run build

The generated application will be available inside:

build/
Important

The application requires:

Internet connection
Camera permission for QR scanning
Location permission for attendance verification
Access to the configured Firebase Realtime Database

Camera and location permissions must be allowed by the student for QR-based attendance to work correctly.

Related Project

This React application is the student-side frontend of the Smart Attendance Management System.

The main system contains separate functionality for:

Administrator
Teacher
Student

The student React application is responsible primarily for:

Student Registration → Student Login → QR Scanning → Location Verification → Attendance Marking

## 👨‍💻 Developer

**Akash Narayankar**

GitHub:

https://github.com/akash274545

Project Repository:

https://github.com/akash274545/student-qr-scan

---

License

This project was developed as part of an academic Smart Attendance Management System project. -->

# Student QR Attendance Application

This is the **student-side React application** of the Smart Attendance Management System.

The application allows students to register, log in after teacher approval, scan attendance QR codes, and mark their attendance securely using QR validation and location verification.

## Features

- Student registration
- Student login
- Teacher approval verification
- Password hashing using bcrypt
- QR code scanning using device camera
- Attendance QR token validation
- QR code expiry validation
- Location-based attendance verification
- 100-meter proximity verification
- Prevents duplicate attendance for the same subject on the same day
- Attendance records stored in Firebase Realtime Database
- Student session management using browser local storage
- Responsive user interface

## Technology Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3

### Libraries

- `html5-qrcode` – QR code scanning
- `bcryptjs` – password hashing and verification

### Database

- Firebase Realtime Database

## Application Workflow

```text
Student
   │
   ▼
Student Registration
   │
   ▼
Teacher Approval
   │
   ▼
Student Login
   │
   ▼
QR Scanner
   │
   ▼
QR Token Validation
   │
   ├── Invalid / Expired QR → Attendance Rejected
   │
   ▼
Location Verification
   │
   ├── More than 100 meters → Attendance Rejected
   │
   ▼
Check Duplicate Attendance
   │
   ├── Already Marked → Attendance Rejected
   │
   ▼
Attendance Saved
   │
   ▼
Firebase Realtime Database
```

## QR Attendance Process

When a student scans a QR code:

1. The application reads the QR code.
2. The attendance token is extracted from the QR code.
3. The token is checked against Firebase.
4. The application verifies that the token is active.
5. The expiry time of the QR code is checked.
6. The student's current location is obtained.
7. The distance between the teacher's location and student's location is calculated.
8. The student must be within **100 meters** of the classroom/teacher location.
9. The system checks whether attendance has already been marked for that subject on the same day.
10. If all validations pass, attendance is stored in Firebase.

## Firebase Database

The React application communicates with Firebase Realtime Database for:

- Student information
- Attendance tokens
- Subjects
- Attendance records

### Example Database Structure

```text
AttendanceSystem
│
├── users
│   └── student records
│
├── attendanceTokens
│   └── QR attendance tokens
│
├── subjects
│   └── subject information
│
├── attendance
│   └── attendance records
│
├── classes
│
└── defaultSubjects
```

## Project Structure

```text
student-qr-scan/
│
├── public/
│
├── src/
│   ├── App.js
│   ├── App.css
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ScanScreen.js
│   ├── firebase.js
│   ├── index.js
│   └── index.css
│
├── build/
├── package.json
├── package-lock.json
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/akash274545/student-qr-scan.git
```

Move into the project directory:

```bash
cd student-qr-scan
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

## Available Scripts

### `npm start`

Runs the application in development mode.

The application automatically reloads when source files are modified.

### `npm run build`

Creates an optimized production build in the `build` directory.

```bash
npm run build
```

### `npm test`

Runs the available tests.

```bash
npm test
```

## Production Build

To create the production version:

```bash
npm run build
```

The generated application will be available inside:

```text
build/
```

The production build can be deployed to a static hosting platform.

## Important

The application requires:

- Internet connection
- Camera permission for QR scanning
- Location permission for attendance verification
- Access to the configured Firebase Realtime Database

Camera and location permissions must be allowed by the student for QR-based attendance to work correctly.

## 🔗 Related Project

This React application is an **optional student-side QR scanning application** developed as a companion to the complete Smart Attendance Management System.

The complete system is available in the main repository:

**Main Project:**  
https://github.com/akash274545/Smart-Attendance-Marking-System-Deploy

### Main System

The **Smart-Attendance-Marking-System** is the complete attendance management application and includes:

- Administrator module
- Teacher module
- Student module
- Subject and class management
- QR attendance token generation
- QR token validation
- Location-based attendance verification
- Duplicate attendance prevention
- Firebase Realtime Database integration
- Monthly attendance reports
- Overall attendance reports
- Email-based attendance reports

### Optional React QR Scanner

The `student-qr-scan` application focuses primarily on the student-side QR attendance process:

**Student Registration → Student Login → QR Scanning → Location Verification → Attendance Marking**

This application can be used as a **dedicated QR scanning interface for students** when a separate React-based scanner is preferred.

It is an **optional companion application and not a replacement for the main Smart Attendance Management System**.









































































































## 👨‍💻 Developer

**Akash Narayankar**

**GitHub:**
https://github.com/akash274545

**React QR Scanner Repository:**  
https://github.com/akash274545/student-qr-scan

**Main Attendance System:**  
https://github.com/akash274545/Smart-Attendance-Marking-System-Deploy

---
## 📚 Academic Project

This project was developed as part of an academic Smart Attendance Management System project.

## License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.
