import { useEffect, useMemo, useState } from "react";
import "../styles/AdminDirectory.css";
const API_URL = "https://smart-attendence-management.onrender.com";

export default function AdminDirectory() {

    const [activeTab, setActiveTab] = useState("students");

    const [students, setStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);

    const [studentLoading, setStudentLoading] = useState(false);
    const [facultyLoading, setFacultyLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [error, setError] = useState("");

    /*
     * Fetch students and faculty
     */
    useEffect(() => {
        fetchStudents();
        fetchFaculty();
    }, []);

    const fetchStudents = async () => {

        try {

            setStudentLoading(true);

            const response = await fetch(
                `${API_URL}/api/students`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }

            const data = await response.json();

            setStudents(data);

        } catch (error) {

            console.error("Student fetch error:", error);

            setError("Unable to load students.");

        } finally {

            setStudentLoading(false);

        }
    };

    const fetchFaculty = async () => {

        try {

            setFacultyLoading(true);

            const response = await fetch(
                `${API_URL}/api/admin/faculty`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch faculty");
            }

            const data = await response.json();

            setFaculty(data);

        } catch (error) {

            console.error("Faculty fetch error:", error);

            setError("Unable to load faculty.");

        } finally {

            setFacultyLoading(false);

        }
    };

    /*
     * Search students
     *
     * Search by:
     * - Student name
     * - Student phone number
     * - Student email
     * - Faculty name
     * - Faculty ID
     */
    const filteredStudents = useMemo(() => {

        const value = search.trim().toLowerCase();

        if (!value) {
            return students;
        }

        return students.filter((student) => {

            const studentName =
                student.studentName?.toLowerCase() || "";

            const phone =
                student.phoneNumber?.toString() || "";

            const email =
                student.email?.toLowerCase() || "";

            const facultyName =
                student.facultyName?.toLowerCase() || "";

            const facultyId =
                student.facultyId?.toString() || "";

            return (
                studentName.includes(value) ||
                phone.includes(value) ||
                email.includes(value) ||
                facultyName.includes(value) ||
                facultyId.includes(value)
            );
        });

    }, [students, search]);


    /*
     * Search faculty
     *
     * Search by:
     * - First name
     * - Last name
     * - Full name
     * - Phone number
     * - Email
     * - Department
     */
    const filteredFaculty = useMemo(() => {

        const value = search.trim().toLowerCase();

        if (!value) {
            return faculty;
        }

        return faculty.filter((item) => {

            const firstName =
                item.firstName?.toLowerCase() || "";

            const lastName =
                item.lastName?.toLowerCase() || "";

            const fullName =
                `${item.firstName || ""} ${item.lastName || ""}`
                    .toLowerCase();

            const phone =
                item.phoneNumber?.toString() ||
                item.phonenumber?.toString() ||
                "";

            const email =
                item.email?.toLowerCase() || "";

            const department =
                item.department?.toLowerCase() || "";

            return (
                firstName.includes(value) ||
                lastName.includes(value) ||
                fullName.includes(value) ||
                phone.includes(value) ||
                email.includes(value) ||
                department.includes(value)
            );
        });

    }, [faculty, search]);


    return (
        <div className="admin-directory">

            {/* Header */}
            <div className="directory-header">

                <div>
                    <h3>
                        Quick Information
                    </h3>

                    <p>
                        View and manage registered students
                        and faculty members.
                    </p>
                </div>

            </div>


            {/* Tabs */}
            <div className="directory-tabs">

                <button
                    className={
                        activeTab === "students"
                            ? "directory-tab active"
                            : "directory-tab"
                    }
                    onClick={() => {
                        setActiveTab("students");
                        setSearch("");
                    }}
                >
                    Students
                    <span className="tab-count">
                        {students.length}
                    </span>
                </button>


                <button
                    className={
                        activeTab === "faculty"
                            ? "directory-tab active"
                            : "directory-tab"
                    }
                    onClick={() => {
                        setActiveTab("faculty");
                        setSearch("");
                    }}
                >
                    Faculty
                    <span className="tab-count">
                        {faculty.length}
                    </span>
                </button>

            </div>


            {/* Search */}
            <div className="directory-toolbar">

                <div className="directory-search">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder={
                            activeTab === "students"
                                ? "Search by student name, phone, email or faculty..."
                                : "Search by faculty name, phone, email or department..."
                        }
                    />

                    {search && (
                        <button
                            className="clear-search"
                            onClick={() => setSearch("")}
                        >
                            ×
                        </button>
                    )}

                </div>

                <div className="directory-result-count">

                    {activeTab === "students"
                        ? `${filteredStudents.length} students`
                        : `${filteredFaculty.length} faculty`
                    }

                </div>

            </div>


            {/* Error */}
            {error && (
                <div className="directory-error">
                    {error}
                </div>
            )}


            {/* Students */}
            {activeTab === "students" && (

                <div className="directory-table-wrapper">

                    {studentLoading ? (

                        <div className="directory-loading">
                            Loading students...
                        </div>

                    ) : filteredStudents.length === 0 ? (

                        <div className="directory-empty">

                            <div className="directory-empty-icon">
                                S
                            </div>

                            <h4>
                                No students found
                            </h4>

                            <p>
                                {search
                                    ? "No students match your search."
                                    : "No students have been registered yet."
                                }
                            </p>

                        </div>

                    ) : (

                        <div className="directory-table">

                            <div className="directory-table-head">

                                <span>Student</span>
                                <span>Contact</span>
                                <span>Class</span>
                                <span>Faculty</span>
                                <span>Faculty ID</span>

                            </div>


                            {filteredStudents.map((student) => (

                                <div
                                    className="directory-table-row"
                                    key={student.studentId}
                                >

                                    {/* Student */}
                                    <div className="person-cell">

                                        <div className="person-avatar">
                                            {student.studentName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "S"}
                                        </div>

                                        <div>
                                            <strong>
                                                {student.studentName}
                                            </strong>

                                            <span>
                                                Student ID:{" "}
                                                {student.studentId}
                                            </span>
                                        </div>

                                    </div>


                                    {/* Contact */}
                                    <div className="contact-cell">

                                        <strong>
                                            {student.email}
                                        </strong>

                                        <span>
                                            {student.phoneNumber}
                                        </span>

                                    </div>


                                    {/* Class */}
                                    <div className="detail-cell">

                                        <strong>
                                            {student.studentClass}
                                        </strong>

                                        <span>
                                            Section{" "}
                                            {student.studentSection}
                                        </span>

                                    </div>


                                    {/* Faculty */}
                                    <div className="detail-cell">

                                        <strong>
                                            {student.facultyName || "-"}
                                        </strong>

                                        <span>
                                            Faculty
                                        </span>

                                    </div>


                                    {/* Faculty ID */}
                                    <div className="id-cell">

                                        <span>
                                            #{student.facultyId || "-"}
                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}


            {/* Faculty */}
            {activeTab === "faculty" && (

                <div className="directory-table-wrapper">

                    {facultyLoading ? (

                        <div className="directory-loading">
                            Loading faculty...
                        </div>

                    ) : filteredFaculty.length === 0 ? (

                        <div className="directory-empty">

                            <div className="directory-empty-icon">
                                F
                            </div>

                            <h4>
                                No faculty found
                            </h4>

                            <p>
                                {search
                                    ? "No faculty members match your search."
                                    : "No faculty members have been registered yet."
                                }
                            </p>

                        </div>

                    ) : (

                        <div className="directory-table">

                            <div className="directory-table-head faculty-head">

                                <span>Faculty</span>
                                <span>Contact</span>
                                <span>Department</span>
                                <span>Class / Section</span>
                                <span>Subject</span>

                            </div>


                            {filteredFaculty.map((item) => (

                                <div
                                    className="directory-table-row faculty-row"
                                    key={item.facultyId}
                                >

                                    {/* Faculty */}
                                    <div className="person-cell">

                                        <div className="person-avatar">
                                            {item.firstName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "F"}
                                        </div>

                                        <div>

                                            <strong>
                                                {item.firstName}{" "}
                                                {item.lastName}
                                            </strong>

                                            <span>
                                                Faculty ID:{" "}
                                                {item.facultyId}
                                            </span>

                                        </div>

                                    </div>


                                    {/* Contact */}
                                    <div className="contact-cell">

                                        <strong>
                                            {item.email}
                                        </strong>

                                        <span>
                                            {item.phoneNumber ??
                                                item.phonenumber}
                                        </span>

                                    </div>


                                    {/* Department */}
                                    <div className="detail-cell">

                                        <strong>
                                            {item.department}
                                        </strong>

                                        <span>
                                            Department
                                        </span>

                                    </div>


                                    {/* Class */}
                                    <div className="detail-cell">

                                        <strong>
                                            {item.className}
                                        </strong>

                                        <span>
                                            Section{" "}
                                            {item.sectionName}
                                        </span>

                                    </div>


                                    {/* Subject */}
                                    <div className="detail-cell">

                                        <strong>
                                            {item.subject}
                                        </strong>

                                        <span>
                                            Assigned subject
                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}