import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/StudentAttendance.css";

const API_URL = "https://smart-attendence-management.onrender.com";

export default function StudentAttendance() {

    const facultyId = useSelector(
        (state) => state.auth.facultyId
    );

    const facultyUserId = useSelector(
        (state) => state.auth.userId
    );

    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getToday = () => {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const today = getToday();

    // =====================================================
    // 6 AM CHECK
    // =====================================================

    const isAttendanceOpen = () => {

        const now = new Date();

        const hours = now.getHours();
        const minutes = now.getMinutes();

        return (
            hours > 6 ||
            (hours === 6 && minutes >= 0)
        );
    };

    const attendanceOpen = isAttendanceOpen();

    // =====================================================
    // LOAD STUDENTS + TODAY ATTENDANCE
    // =====================================================

    useEffect(() => {

        if (!facultyId) {
            setError("Faculty information not found.");
            setLoading(false);
            return;
        }

        loadStudentsAndAttendance();

    }, [facultyId]);

    const loadStudentsAndAttendance = async () => {

        try {

            setLoading(true);
            setError("");

            // -----------------------------------------
            // GET STUDENTS BY FACULTY
            // -----------------------------------------

            const studentsResponse = await fetch(
                `${API_URL}/api/faculty/${facultyId}/students`
            );

            if (!studentsResponse.ok) {
                throw new Error(
                    "Failed to fetch students"
                );
            }

            const studentsData =
                await studentsResponse.json();

            setStudents(studentsData);

            // -----------------------------------------
            // GET TODAY ATTENDANCE
            // -----------------------------------------

            const attendanceResponse =
                await fetch(
                    `${API_URL}/api/faculty/${facultyId}/student-attendance?date=${today}`
                );

            if (!attendanceResponse.ok) {
                throw new Error(
                    "Failed to fetch today's attendance"
                );
            }

            const attendanceData =
                await attendanceResponse.json();

            // -----------------------------------------
            // IF ALREADY SUBMITTED
            // -----------------------------------------

            if (attendanceData.length > 0) {

                const attendanceMap = {};

                attendanceData.forEach((record) => {

                    attendanceMap[
                        record.studentId
                    ] = record.status;

                });

                setAttendance(attendanceMap);

                setSubmitted(true);

            } else {

                // -----------------------------------------
                // DEFAULT ALL STUDENTS TO PRESENT
                // -----------------------------------------

                const defaultAttendance = {};

                studentsData.forEach((student) => {

                    defaultAttendance[
                        student.studentId
                    ] = "PRESENT";

                });

                setAttendance(
                    defaultAttendance
                );

                setSubmitted(false);
            }

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to load student attendance"
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // CHANGE STATUS
    // =====================================================

    const handleStatusChange = (
        studentId,
        status
    ) => {

        setAttendance((previous) => ({
            ...previous,
            [studentId]: status
        }));
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async () => {

        if (!attendanceOpen) {

            setError(
                "Student attendance opens at 6:00 AM"
            );

            return;
        }

        if (submitted) {

            setError(
                "Today's attendance has already been submitted."
            );

            return;
        }

        if (!students.length) {

            setError(
                "No students found for this faculty."
            );

            return;
        }

        try {

            setSubmitting(true);
            setError("");
            setSuccess("");

            const attendanceList =
                students.map((student) => ({
                    studentId:
                        student.studentId,

                    status:
                        attendance[
                            student.studentId
                        ] || "PRESENT"
                }));

            const response = await fetch(
                `${API_URL}/api/faculty/${facultyId}/student-attendance?facultyUserId=${facultyUserId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        attendanceDate: today,
                        attendance:
                            attendanceList
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to submit attendance"
                );
            }

            setSuccess(
                "Student attendance submitted successfully."
            );

            // -----------------------------------------
            // GET API AGAIN
            // -----------------------------------------

            const attendanceResponse =
                await fetch(
                    `${API_URL}/api/faculty/${facultyId}/student-attendance?date=${today}`
                );

            const attendanceData =
                await attendanceResponse.json();

            const attendanceMap = {};

            attendanceData.forEach((record) => {

                attendanceMap[
                    record.studentId
                ] = record.status;

            });

            setAttendance(attendanceMap);

            setSubmitted(true);

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to submit attendance"
            );

        } finally {

            setSubmitting(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="student-attendance-page">
                <div className="student-attendance-message">
                    Loading students...
                </div>
            </div>
        );
    }

    return (
        <div className="student-attendance-page">

            {/* HEADER */}

            {/* <div className="student-attendance-header">

                <div>
                    <h1>
                        Student Attendance
                    </h1>

                    <p>
                        Mark attendance for your
                        assigned students.
                    </p>
                </div>

                <div
                    className={`attendance-open-status ${
                        attendanceOpen
                            ? "open"
                            : "closed"
                    }`}
                >
                    {attendanceOpen
                        ? "Attendance Open"
                        : "Opens at 6:00 AM"}
                </div>

            </div> */}

            {/* RULES */}

            <div className="student-attendance-rules">

                <strong>
                    Attendance Rules
                </strong>

                <ul>
                    <li>
                        Attendance opens at
                        6:00 AM.
                    </li>

                    <li>
                        All students are
                        initially marked PRESENT.
                    </li>

                    <li>
                        Change a student to
                        ABSENT when required.
                    </li>

                    <li>
                        Attendance can be
                        submitted only once per day.
                    </li>

                    <li>
                        After submission,
                        attendance becomes read-only.
                    </li>
                </ul>

            </div>

            {/* ERROR */}

            {error && (
                <div className="student-attendance-error">
                    {error}
                </div>
            )}

            {/* SUCCESS */}

            {success && (
                <div className="student-attendance-success">
                    {success}
                </div>
            )}

            {/* STUDENT LIST */}

            {students.length === 0 ? (

                <div className="student-attendance-message">

                    <h3>
                        No students found
                    </h3>

                    <p>
                        No students are currently
                        assigned to you.
                    </p>

                </div>

            ) : (

                <div className="student-attendance-list">

                    {students.map((student, index) => {

                        const status =
                            attendance[
                                student.studentId
                            ] || "PRESENT";

                        return (
                            <div
                                className="student-attendance-card"
                                key={
                                    student.studentId
                                }
                            >

                                <div className="student-number">
                                    {index + 1}
                                </div>

                                <div className="student-info">

                                    <h3>
                                        {student.studentName}
                                    </h3>

                                    <div className="student-meta">

                                        <span>
                                            ID:{" "}
                                            {
                                                student.studentId
                                            }
                                        </span>

                                        <span>
                                            {
                                                student.email
                                            }
                                        </span>

                                        <span>
                                            {
                                                student.studentClass
                                            }
                                            {" / "}
                                            {
                                                student.studentSection
                                            }
                                        </span>

                                    </div>

                                </div>

                                <div className="student-status">

                                    <button
                                        type="button"
                                        disabled={
                                            submitted ||
                                            !attendanceOpen
                                        }
                                        className={
                                            status ===
                                            "PRESENT"
                                                ? "status-btn present active"
                                                : "status-btn present"
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                student.studentId,
                                                "PRESENT"
                                            )
                                        }
                                    >
                                        Present
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            submitted ||
                                            !attendanceOpen
                                        }
                                        className={
                                            status ===
                                            "ABSENT"
                                                ? "status-btn absent active"
                                                : "status-btn absent"
                                        }
                                        onClick={() =>
                                            handleStatusChange(
                                                student.studentId,
                                                "ABSENT"
                                            )
                                        }
                                    >
                                        Absent
                                    </button>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

            {/* SUBMIT */}

            {students.length > 0 && (

                <div className="student-attendance-submit">

                    {submitted ? (

                        <div className="submitted-label">
                            ✓ Attendance Submitted
                        </div>

                    ) : (

                        <button
                            className="submit-student-attendance"
                            disabled={
                                submitting ||
                                !attendanceOpen
                            }
                            onClick={handleSubmit}
                        >
                            {submitting
                                ? "Submitting..."
                                : attendanceOpen
                                    ? "Submit Attendance"
                                    : "Attendance Opens at 6:00 AM"}
                        </button>

                    )}

                </div>
            )}

        </div>
    );
}