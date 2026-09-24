import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/StudentAttendanceHistory.css";
import StudentAttendanceDetails from "./StudentAttendanceDetails"
const API_URL = "http://localhost:8081";

export default function StudentAttendanceHistory() {

    const facultyId = useSelector(
        (state) => state.auth.facultyId
    );

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] =
        useState(null);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        if (facultyId) {
            fetchStudents();
        }

    }, [facultyId]);

    const fetchStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/faculty/${facultyId}/students`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch students"
                );
            }

            const data = await response.json();

            setStudents(data);

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to load students"
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================
    // SHOW SELECTED STUDENT
    // =========================================

    if (selectedStudent) {

        return (
            <StudentAttendanceDetails
                student={selectedStudent}
                onBack={() =>
                    setSelectedStudent(null)
                }
            />
        );
    }

    // =========================================
    // SEARCH
    // =========================================

    const filteredStudents =
        students.filter((student) => {

            const value =
                search
                    .toLowerCase()
                    .trim();

            if (!value) {
                return true;
            }

            return (
                String(
                    student.studentName || ""
                )
                    .toLowerCase()
                    .includes(value) ||

                String(
                    student.studentId || ""
                )
                    .includes(value) ||

                String(
                    student.email || ""
                )
                    .toLowerCase()
                    .includes(value) ||

                String(
                    student.studentClass || ""
                )
                    .toLowerCase()
                    .includes(value) ||

                String(
                    student.studentSection || ""
                )
                    .toLowerCase()
                    .includes(value)
            );
        });

    if (loading) {

        return (
            <div className="student-history-page">
                <div className="student-history-message">
                    Loading students...
                </div>
            </div>
        );
    }

    return (
        <div className="student-history-page">

            {/* HEADER */}

            {/* <div className="student-history-header">

                <div>
                    <h1>
                        Student Attendance History
                    </h1>

                    <p>
                        Select a student to view
                        attendance history.
                    </p>
                </div>

                <div className="student-total">
                    <strong>
                        {students.length}
                    </strong>

                    <span>
                        Total Students
                    </span>
                </div>

            </div> */}

            {/* SEARCH */}

            <div className="student-history-search">

                <input
                    type="text"
                    placeholder="Search by student name, ID, email..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
                
            </div>

            {error && (
                <div className="student-history-error">
                    {error}
                </div>
            )}

            {/* STUDENT CARDS */}

            {filteredStudents.length === 0 ? (

                <div className="student-history-message">

                    <h3>
                        No students found
                    </h3>

                    <p>
                        No students match your
                        search.
                    </p>

                </div>

            ) : (

                <div className="student-history-list">

                    {filteredStudents.map(
                        (student) => (

                            <div
                                className="student-history-card"
                                key={
                                    student.studentId
                                }
                            >

                                {/* NAME */}

                                <div className="student-history-name">

                                    <div className="student-history-avatar">
                                        {student.studentName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <h3>
                                            {
                                                student.studentName
                                            }
                                        </h3>

                                        <span>
                                            Student ID:{" "}
                                            {
                                                student.studentId
                                            }
                                        </span>
                                    </div>

                                </div>

                                {/* CLASS */}

                                <div className="student-history-info">

                                    <span>
                                        Class
                                    </span>

                                    <strong>
                                        {
                                            student.studentClass
                                        }
                                        {" / "}
                                        {
                                            student.studentSection
                                        }
                                    </strong>

                                </div>

                                {/* EMAIL */}

                                <div className="student-history-info">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {
                                            student.email ||
                                            "-"
                                        }
                                    </strong>

                                </div>

                                {/* BUTTON */}

                                <button
                                    className="student-history-button"
                                    onClick={() =>
                                        setSelectedStudent(
                                            student
                                        )
                                    }
                                >
                                    View History
                                    <span>→</span>
                                </button>

                            </div>

                        )
                    )}

                </div>
            )}

        </div>
    );
}