# Smart Attendance Management System

## 📌 Project Overview

Smart Attendance Management System is a web-based application designed to manage faculty, students, and attendance records in an educational institution.

The system provides separate workflows for three roles:

- **Admin**
- **Faculty**
- **Student**

Each role has specific responsibilities for user onboarding, attendance management, and attendance history.

---

## 👥 User Roles

### 👨‍💼 Admin

Admin is responsible for managing faculty-related operations.

**Admin can:**
- Onboard faculty members
- Manage faculty information
- Manage faculty attendance
- View faculty attendance history

### 👨‍🏫 Faculty

Faculty members are responsible for managing students and student attendance.

**Faculty can:**
- Login using their registered email
- Register students
- Automatically associate students with their class and section
- Mark student attendance
- View their own attendance history
- View student attendance history

### 👨‍🎓 Student

Students are registered by Faculty.

**Students can:**
- Login using their registered email
- View their attendance summary
- View attendance history
- View present and absent records
- View their student information

---

## 🔐 Registration & Login

The system does not provide public signup.

- **Admin:** Admin account is created directly in the system.
- **Faculty:** Faculty accounts are registered by Admin during Faculty Onboarding.
- **Student:** Student accounts are registered by Faculty during Student Onboarding.

Users login using their registered email address.

---

## 📋 Attendance Management

The system manages faculty and student attendance separately.

### Faculty Attendance

```text
Admin
  ↓
Faculty Attendance
  ↓
Mark Attendance
  ↓
View Attendance History
