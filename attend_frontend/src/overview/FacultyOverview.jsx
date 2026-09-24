import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FacultyStudents from "./FacultyStudents";
import "../styles/FacultyOverview.css"
const API_URL = "https://smart-attendence-management.onrender.com";

export default function FacultyOverview() {

    const email = useSelector(
        (state) => state.auth.email
    );

    const facultyId = useSelector(
        (state) => state.auth.facultyId
    );


    const [faculty, setFaculty] = useState(null);

    const [students, setStudents] = useState([]);

    const [facultyLoading, setFacultyLoading] =
        useState(true);

    const [studentsLoading, setStudentsLoading] =
        useState(true);

    const [error, setError] = useState("");


    /*
     * Fetch faculty details
     */
    const fetchFaculty = async () => {

        try {

            setFacultyLoading(true);

            const response = await fetch(
                `${API_URL}/api/admin/faculty/${facultyId}`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch faculty details"
                );
            }

            const data = await response.json();

            setFaculty(data);

        } catch (error) {

            console.error(
                "Faculty fetch error:",
                error
            );

            setError(
                "Unable to load faculty information."
            );

        } finally {

            setFacultyLoading(false);

        }
    };


    /*
     * Fetch students assigned to this faculty
     */
    const fetchStudents = async () => {

        try {

            setStudentsLoading(true);

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

            console.error(
                "Students fetch error:",
                error
            );

            setError(
                "Unable to load students."
            );

        } finally {

            setStudentsLoading(false);

        }
    };


    /*
     * Call both APIs
     */
    useEffect(() => {

        if (!facultyId) {
            return;
        }

        fetchFaculty();
        fetchStudents();

    }, [facultyId]);


    return (
        <div className="dashboard-page">


            {/* =================================
                PAGE HEADER
            ================================= */}

            {/* <div className="page-header">

                <div>

                    <span className="page-label">
                        FACULTY
                    </span>

                    <h2>
                        Faculty Overview
                    </h2>

                    <p>
                        Manage your assigned students
                        and attendance activities.
                    </p>

                </div>

            </div> */}


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="faculty-overview-error">
                    {error}
                </div>

            )}


            {/* =================================
                STATISTICS
            ================================= */}
{/* 
            <div className="overview-section">

                <div className="overview-grid">

                    <div className="overview-card">

                        <div className="overview-card-top">

                            <span>
                                Students
                            </span>

                            <div className="overview-icon">
                                S
                            </div>

                        </div>

                        <strong>

                            {studentsLoading
                                ? "..."
                                : students.length
                            }

                        </strong>

                        <p>
                            Students assigned to you
                        </p>

                    </div>



                    <div className="overview-card">

                        <div className="overview-card-top">

                            <span>
                                Department
                            </span>

                            <div className="overview-icon">
                                D
                            </div>

                        </div>

                        <strong className="overview-card-value-text">

                            {facultyLoading
                                ? "..."
                                : faculty?.department || "—"
                            }

                        </strong>

                        <p>
                            Assigned department
                        </p>

                    </div>



                    <div className="overview-card">

                        <div className="overview-card-top">

                            <span>
                                Subject
                            </span>

                            <div className="overview-icon">
                                B
                            </div>

                        </div>

                        <strong className="overview-card-value-text">

                            {facultyLoading
                                ? "..."
                                : faculty?.subject || "—"
                            }

                        </strong>

                        <p>
                            Assigned subject
                        </p>

                    </div>



                    <div className="overview-card">

                        <div className="overview-card-top">

                            <span>
                                Attendance
                            </span>

                            <div className="overview-icon">
                                %
                            </div>

                        </div>

                        <strong>
                            0%
                        </strong>

                        <p>
                            Current attendance
                        </p>

                    </div>

                </div>

            </div> */}


            {/* =================================
                FACULTY INFORMATION
            ================================= */}

            <div className="dashboard-panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Faculty Information
                        </h3>

                        <p>
                            Your account and assigned
                            academic information
                        </p>

                    </div>

                </div>


                {facultyLoading ? (

                    <div className="faculty-info-loading">
                        Loading faculty information...
                    </div>

                ) : (

                    <div className="info-grid">


                        {/* Faculty ID */}

                        {/* <div className="info-item">

                            <span>
                                Faculty ID
                            </span>

                            <strong>
                                {faculty?.facultyId || facultyId || "—"}
                            </strong>

                        </div> */}


                        {/* Faculty Name */}

                        <div className="info-item">

                            <span>
                                Faculty Name
                            </span>

                            <strong>
                                {faculty
                                    ? `${faculty.firstName || ""} ${faculty.lastName || ""}`.trim()
                                    : "—"
                                }
                            </strong>

                        </div>


                        {/* Email */}

                        {/* <div className="info-item">

                            <span>
                                Email
                            </span>

                            <strong>
                                {faculty?.email || email || "—"}
                            </strong>

                        </div> */}


                        {/* Phone */}

                        <div className="info-item">

                            <span>
                                Phone
                            </span>

                            <strong>
                                {faculty?.phoneNumber ??
                                    faculty?.phonenumber ??
                                    "—"
                                }
                            </strong>

                        </div>


                        {/* Department */}

                        <div className="info-item">

                            <span>
                                Department
                            </span>

                            <strong>
                                {faculty?.department || "—"}
                            </strong>

                        </div>


                        {/* Subject */}

                        <div className="info-item">

                            <span>
                                Subject
                            </span>

                            <strong>
                                {faculty?.subject || "—"}
                            </strong>

                        </div>


                        {/* Class */}

                        <div className="info-item">

                            <span>
                                Class
                            </span>

                            <strong>
                                {faculty?.className || "—"}
                            </strong>

                        </div>


                        {/* Section */}

                        <div className="info-item">

                            <span>
                                Section
                            </span>

                            <strong>
                                {faculty?.sectionName || "—"}
                            </strong>

                        </div>

                    </div>

                )}

            </div>


            {/* =================================
                STUDENTS
            ================================= */}

            <FacultyStudents
                students={students}
                loading={studentsLoading}
            />

        </div>
    );
}