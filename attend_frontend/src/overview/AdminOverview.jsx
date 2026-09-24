import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AdminDirectory from "./AdminDirectory";

const API_URL = "http://localhost:8081";

export default function AdminOverview() {

    const email = useSelector(
        (state) => state.auth.email
    );

    const [faculty, setFaculty] = useState([]);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);

    /*
     * Fetch faculty and students
     */
    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                setLoading(true);

                const [facultyResponse, studentResponse] =
                    await Promise.all([
                        fetch(`${API_URL}/api/admin/faculty`),
                        fetch(`${API_URL}/api/students`)
                    ]);

                if (!facultyResponse.ok) {
                    throw new Error("Failed to fetch faculty");
                }

                if (!studentResponse.ok) {
                    throw new Error("Failed to fetch students");
                }

                const facultyData =
                    await facultyResponse.json();

                const studentData =
                    await studentResponse.json();

                setFaculty(facultyData);
                setStudents(studentData);

            } catch (error) {

                console.error(
                    "Dashboard data error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchDashboardData();

    }, []);


    /*
     * Calculate unique departments
     */
    const totalDepartments = useMemo(() => {

        const departments = faculty
            .map((item) => item.department)
            .filter(Boolean)
            .map((item) => item.trim().toLowerCase());

        return new Set(departments).size;

    }, [faculty]);


    return (
        <div className="dashboard-page">

            {/* Page Header */}

            {/* <div className="page-header">

                <div>

                    <span className="page-label">
                        ADMINISTRATION
                    </span>

                    <h2>
                        Admin Overview
                    </h2>

                    <p>
                        Manage faculty, students and
                        attendance operations from one place.
                    </p>

                </div>

            </div> */}


            {/* Statistics */}

            <div className="overview-section">

                <div className="overview-grid">

                    {/* Faculty */}

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
                            {loading
                                ? "..."
                                : faculty.length
                            }
                        </strong>

                        <p>
                            Registered faculty members
                        </p>

                    </div>


                    {/* Students */}

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
                            {loading
                                ? "..."
                                : students.length
                            }
                        </strong>

                        <p>
                            Registered students
                        </p>

                    </div>


                    {/* Departments */}

                    <div className="overview-card">

                        <div className="overview-card-top">

                            <span>
                                Departments
                            </span>

                            <div className="overview-icon">
                                D
                            </div>

                        </div>

                        <strong>
                            {loading
                                ? "..."
                                : totalDepartments
                            }
                        </strong>

                        <p>
                            Active departments
                        </p>

                    </div>


                    {/* Attendance */}

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
                            Overall attendance
                        </p>

                    </div>

                </div>

            </div>


            {/* Quick Information */}

            <div className="dashboard-panel">

                <AdminDirectory />

            </div>

        </div>
    );
}