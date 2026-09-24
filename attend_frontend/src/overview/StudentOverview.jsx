import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function StudentOverview() {

    const email = useSelector(
        (state) => state.auth.email
    );

    const studentId = useSelector(
        (state) => state.auth.studentId
    );

    const facultyId = useSelector(
        (state) => state.auth.facultyId
    );


    // -----------------------------
    // Attendance
    // -----------------------------

    const [presentCount, setPresentCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);
    const [attendanceLoading, setAttendanceLoading] = useState(true);


    // -----------------------------
    // Student Details
    // -----------------------------

    const [student, setStudent] = useState(null);
    const [studentLoading, setStudentLoading] = useState(true);


    // -----------------------------
    // Current Month
    // -----------------------------

    const getCurrentMonthDates = () => {

        const now = new Date();

        const year = now.getFullYear();
        const month = now.getMonth();

        const firstDay = new Date(
            year,
            month,
            1
        );

        const formatDate = (date) => {

            const y = date.getFullYear();

            const m = String(
                date.getMonth() + 1
            ).padStart(2, "0");

            const d = String(
                date.getDate()
            ).padStart(2, "0");

            return `${y}-${m}-${d}`;
        };

        return {
            fromDate: formatDate(firstDay),
            toDate: formatDate(now)
        };
    };


    // =====================================================
    // FETCH STUDENT DETAILS BY STUDENT ID
    // =====================================================

    useEffect(() => {

        const fetchStudentDetails = async () => {

            if (!studentId) {

                setStudentLoading(false);

                return;
            }

            try {

                setStudentLoading(true);

                const response = await fetch(
                    `http://localhost:8081/api/students/${studentId}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch student details"
                    );
                }

                const data = await response.json();

                console.log(
                    "Student details:",
                    data
                );

                setStudent(data);

            } catch (error) {

                console.error(
                    "Error fetching student details:",
                    error
                );

                setStudent(null);

            } finally {

                setStudentLoading(false);

            }
        };

        fetchStudentDetails();

    }, [studentId]);


    // =====================================================
    // FETCH CURRENT MONTH ATTENDANCE
    // =====================================================

    useEffect(() => {

        const fetchAttendance = async () => {

            if (!studentId) {

                setAttendanceLoading(false);

                return;
            }

            try {

                setAttendanceLoading(true);

                const {
                    fromDate,
                    toDate
                } = getCurrentMonthDates();


                const response = await fetch(
                    `http://localhost:8081/api/faculty/student/${studentId}/attendance?fromDate=${fromDate}&toDate=${toDate}`
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch attendance"
                    );

                }


                const data =
                    await response.json();


                const present =
                    data.filter(
                        (item) =>
                            item.status?.toUpperCase() ===
                            "PRESENT"
                    ).length;


                const absent =
                    data.filter(
                        (item) =>
                            item.status?.toUpperCase() ===
                            "ABSENT"
                    ).length;


                setPresentCount(
                    present
                );

                setAbsentCount(
                    absent
                );

            } catch (error) {

                console.error(
                    "Error fetching student attendance:",
                    error
                );

                setPresentCount(0);

                setAbsentCount(0);

            } finally {

                setAttendanceLoading(false);

            }
        };


        fetchAttendance();

    }, [studentId]);


    return (

        <div className="dashboard-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            {/* <div className="page-header">

                <div>

                    <span className="page-label">
                        STUDENT
                    </span>

                    <h2>
                        Student Overview
                    </h2>

                    <p>
                        View your attendance and
                        academic information.
                    </p>

                </div>

            </div> */}


            {/* =================================================
                WELCOME
            ================================================= */}

            <div className="welcome-card">

                <div>

                    <span className="welcome-label">
                        WELCOME BACK
                    </span>

                    <h3>
                        {student?.studentName ||
                            "Student Dashboard"}
                    </h3>

                    <p>
                        Keep track of your attendance
                        and academic progress.
                    </p>

                </div>


                <div className="welcome-avatar">

                    {email
                        ? email
                            .charAt(0)
                            .toUpperCase()
                        : "S"}

                </div>

            </div>


            {/* =================================================
                ATTENDANCE OVERVIEW
            ================================================= */}

            <div className="overview-section">

                <div className="section-heading">

                    <div>

                        <h3>
                            Attendance Overview
                        </h3>

                        <p>
                            Your attendance for the
                            current month
                        </p>

                    </div>

                </div>


                <div className="overview-grid">


                    {/* PRESENT */}

                    <div className="overview-card">

                        <div className="overview-card-top">

                            <span>
                                Present
                            </span>

                            <div className="overview-icon">
                                P
                            </div>

                        </div>


                        <strong>

                            {attendanceLoading
                                ? "..."
                                : presentCount}

                        </strong>


                        <p>
                            Classes attended
                        </p>

                    </div>


                    {/* ABSENT */}

                    <div className="overview-card">

                        <div className="overview-card-top">

                            <span>
                                Absent
                            </span>

                            <div className="overview-icon">
                                A
                            </div>

                        </div>


                        <strong>

                            {attendanceLoading
                                ? "..."
                                : absentCount}

                        </strong>


                        <p>
                            Classes missed
                        </p>

                    </div>


                    {/* STUDENT ID */}

                    <div className="overview-card">

                        <div className="overview-card-top">

                            <span>
                                Student ID
                            </span>

                            <div className="overview-icon">
                                ID
                            </div>

                        </div>


                        <strong>
                            {student?.studentId ||
                                studentId ||
                                "—"}
                        </strong>


                        <p>
                            Student identification
                        </p>

                    </div>


                    {/* FACULTY */}

                    <div className="overview-card">

                        <div className="overview-card-top">

                            <span>
                                Faculty
                            </span>

                            <div className="overview-icon">
                                F
                            </div>

                        </div>


                        <strong>

                            {student?.facultyName ||
                                facultyId ||
                                "—"}

                        </strong>


                        <p>
                            Assigned faculty
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                STUDENT INFORMATION
            ================================================= */}

            <div className="dashboard-panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Student Information
                        </h3>

                        <p>
                            Your complete student information
                        </p>

                    </div>

                </div>


                {studentLoading ? (

                    <div className="student-info-loading">
                        Loading student information...
                    </div>

                ) : student ? (

                    <div className="info-grid">


                        {/* STUDENT ID */}

                        <div className="info-item">

                            <span>
                                Student ID
                            </span>

                            <strong>
                                {student.studentId ||
                                    "—"}
                            </strong>

                        </div>


                        {/* USER ID */}

                        <div className="info-item">

                            <span>
                                User ID
                            </span>

                            <strong>
                                {student.userId ||
                                    "—"}
                            </strong>

                        </div>


                        {/* STUDENT NAME */}

                        <div className="info-item">

                            <span>
                                Student Name
                            </span>

                            <strong>
                                {student.studentName ||
                                    "—"}
                            </strong>

                        </div>


                        {/* AGE */}

                        <div className="info-item">

                            <span>
                                Age
                            </span>

                            <strong>
                                {student.studentAge ??
                                    "—"}
                            </strong>

                        </div>


                        {/* EMAIL */}

                        <div className="info-item">

                            <span>
                                Email
                            </span>

                            <strong>
                                {student.email ||
                                    email ||
                                    "—"}
                            </strong>

                        </div>


                        {/* PHONE */}

                        <div className="info-item">

                            <span>
                                Phone Number
                            </span>

                            <strong>
                                {student.phoneNumber ||
                                    "—"}
                            </strong>

                        </div>


                        {/* CLASS */}

                        <div className="info-item">

                            <span>
                                Class
                            </span>

                            <strong>
                                {student.studentClass ||
                                    "—"}
                            </strong>

                        </div>


                        {/* SECTION */}

                        <div className="info-item">

                            <span>
                                Section
                            </span>

                            <strong>
                                {student.studentSection ||
                                    "—"}
                            </strong>

                        </div>


                        {/* FACULTY ID */}

                        <div className="info-item">

                            <span>
                                Faculty ID
                            </span>

                            <strong>
                                {student.facultyId ||
                                    facultyId ||
                                    "—"}
                            </strong>

                        </div>


                        {/* FACULTY NAME */}

                        <div className="info-item">

                            <span>
                                Faculty Name
                            </span>

                            <strong>
                                {student.facultyName ||
                                    "—"}
                            </strong>

                        </div>


                    </div>

                ) : (

                    <div className="student-info-loading">
                        Student information not found.
                    </div>

                )}

            </div>

        </div>
    );
}