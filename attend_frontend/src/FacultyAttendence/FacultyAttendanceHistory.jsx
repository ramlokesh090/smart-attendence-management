import { useEffect, useState } from "react";
import FacultyAttendanceDetails from "./FacultyAttendanceDetails";
import "../styles/FacultyAttendanceHistory.css";

const API_URL = "http://localhost:8081";

export default function FacultyAttendanceHistory() {

    const [facultyList, setFacultyList] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchFaculty();
    }, []);

    const fetchFaculty = async () => {

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/admin/faculty`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch faculty");
            }

            const data = await response.json();

            setFacultyList(data);

        } catch (error) {

            console.error(error);

            setError(
                error.message || "Unable to load faculty"
            );

        } finally {

            setLoading(false);
        }
    };

    // -----------------------------------------
    // IF FACULTY SELECTED
    // SHOW ATTENDANCE DETAILS
    // -----------------------------------------

    if (selectedFaculty) {

        return (
            <FacultyAttendanceDetails
                faculty={selectedFaculty}
                onBack={() => setSelectedFaculty(null)}
            />
        );
    }

    // -----------------------------------------
    // SEARCH
    // -----------------------------------------

    const filteredFaculty = facultyList.filter((faculty) => {

        const searchValue = search
            .toLowerCase()
            .trim();

        if (!searchValue) {
            return true;
        }

        const facultyName =
            `${faculty.firstName || ""} ${faculty.lastName || ""}`
                .toLowerCase();

        return (
            facultyName.includes(searchValue) ||
            String(faculty.facultyId || "")
                .toLowerCase()
                .includes(searchValue) ||
            String(faculty.email || "")
                .toLowerCase()
                .includes(searchValue) ||
            String(faculty.department || "")
                .toLowerCase()
                .includes(searchValue) ||
            String(faculty.subject || "")
                .toLowerCase()
                .includes(searchValue)
        );
    });

    // -----------------------------------------
    // LOADING
    // -----------------------------------------

    if (loading) {
        return (
            <div className="attendance-history-page">
                <div className="attendance-history-loading">
                    Loading faculty...
                </div>
            </div>
        );
    }

    // -----------------------------------------
    // ERROR
    // -----------------------------------------

    if (error) {
        return (
            <div className="attendance-history-page">

                <div className="attendance-history-header">
                    <div>
                        <h1>Faculty Attendance History</h1>
                        <p>
                            View faculty attendance records
                        </p>
                    </div>
                </div>

                <div className="attendance-history-error">
                    {error}
                </div>

            </div>
        );
    }

    return (
        <div className="attendance-history-page">

            {/* HEADER */}

            {/* <div className="attendance-history-header">

                <div>
                    <h1>Faculty Attendance History</h1>

                    <p>
                        Select a faculty member to view
                        attendance records.
                    </p>
                </div>

                <div className="faculty-total">
                    <span>{facultyList.length}</span>
                    <small>Total Faculty</small>
                </div>

            </div> */}

            {/* SEARCH */}

            <div className="attendance-history-toolbar">

                <input
                    type="text"
                    placeholder="Search faculty by name, email, department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            {/* FACULTY LIST */}

            {filteredFaculty.length === 0 ? (

                <div className="attendance-history-empty">
                    <h3>No faculty found</h3>

                    <p>
                        No faculty members match your search.
                    </p>
                </div>

            ) : (

                <div className="faculty-history-grid">

                    {filteredFaculty.map((faculty) => {

                        const facultyName =
                            `${faculty.firstName || ""} ${
                                faculty.lastName || ""
                            }`.trim();

                        return (
                            <div
                                className="faculty-history-card"
                                key={faculty.facultyId}
                            >

                                <div className="faculty-history-card-top">

                                    <div className="faculty-avatar">
                                        {facultyName
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div className="faculty-card-title">

                                        <h3>
                                            {facultyName ||
                                                "Faculty"}
                                        </h3>

                                        <span>
                                            Faculty ID:{" "}
                                            {faculty.facultyId}
                                        </span>

                                    </div>

                                </div>

                                <div className="faculty-card-info">

                                    <div>
                                        <label>Email</label>
                                        <span>
                                            {faculty.email || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <label>Department</label>
                                        <span>
                                            {faculty.department || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <label>Subject</label>
                                        <span>
                                            {faculty.subject || "-"}
                                        </span>
                                    </div>

                                    <div>
                                        <label>Class / Section</label>
                                        <span>
                                            {faculty.className || "-"}
                                            {" / "}
                                            {faculty.sectionName || "-"}
                                        </span>
                                    </div>

                                </div>

                                <button
                                    className="view-attendance-btn"
                                    onClick={() =>
                                        setSelectedFaculty(faculty)
                                    }
                                >
                                    View Attendance
                                    <span>→</span>
                                </button>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}