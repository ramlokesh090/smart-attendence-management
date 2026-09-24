import { useEffect, useState } from "react";
import "../styles/FacultyAttendanceDetails.css";
const API_URL = "https://smart-attendence-management.onrender.com";

export default function FacultyAttendanceDetails({
    faculty,
    onBack
}) {

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

    const getFirstDayOfCurrentMonth = () => {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        return `${year}-${month}-01`;
    };

    const [fromDate, setFromDate] = useState(
        getFirstDayOfCurrentMonth()
    );

    const [toDate, setToDate] = useState(
        getToday()
    );

    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searched, setSearched] = useState(false);

    // -----------------------------------------
    // LOAD CURRENT MONTH ATTENDANCE
    // -----------------------------------------

    useEffect(() => {

        fetchAttendance(
            getFirstDayOfCurrentMonth(),
            getToday()
        );

    }, [faculty.facultyId]);

    // -----------------------------------------
    // FETCH ATTENDANCE
    // -----------------------------------------

    const fetchAttendance = async (
        startDate,
        endDate
    ) => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/admin/faculty/${
                    faculty.facultyId
                }/attendance?fromDate=${
                    startDate
                }&toDate=${
                    endDate
                }`
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch attendance"
                );
            }

            const data = await response.json();

            setAttendance(data);

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to load attendance"
            );

        } finally {

            setLoading(false);
        }
    };

    // -----------------------------------------
    // APPLY FILTER
    // -----------------------------------------

    const handleFilter = () => {

        if (!fromDate || !toDate) {

            setError(
                "Please select both dates."
            );

            return;
        }

        if (fromDate > toDate) {

            setError(
                "From date cannot be after To date."
            );

            return;
        }

        setSearched(true);

        fetchAttendance(
            fromDate,
            toDate
        );
    };

    // -----------------------------------------
    // FACULTY NAME
    // -----------------------------------------

    const facultyName =
        `${faculty.firstName || ""} ${
            faculty.lastName || ""
        }`.trim();

    // -----------------------------------------
    // COUNT
    // -----------------------------------------

    const presentCount =
        attendance.filter(
            (item) =>
                item.status === "PRESENT"
        ).length;

    const absentCount =
        attendance.filter(
            (item) =>
                item.status === "ABSENT"
        ).length;

    return (
        <div className="attendance-details-page">

            {/* HEADER */}

            <div className="attendance-details-header">

                <button
                    className="attendance-back-btn"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <div className="attendance-details-title">

                    <h1>
                        Faculty Attendance
                    </h1>

                    <p>
                        Attendance history and
                        date-wise records
                    </p>

                </div>

            </div>

            {/* FACULTY INFORMATION */}

            <div className="faculty-details-card">

                <div className="faculty-details-avatar">
                    {facultyName
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div className="faculty-details-main">

                    <h2>
                        {facultyName}
                    </h2>

                    <p>
                        Faculty ID:{" "}
                        {faculty.facultyId}
                    </p>

                </div>

                <div className="faculty-details-info">

                    <div>
                        <span>Department</span>
                        <strong>
                            {faculty.department || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>Subject</span>
                        <strong>
                            {faculty.subject || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>Class</span>
                        <strong>
                            {faculty.className || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>Section</span>
                        <strong>
                            {faculty.sectionName || "-"}
                        </strong>
                    </div>
                    
                </div>

            </div>

{/* SUMMARY */}

            {!loading && !error && (
                <div className="attendance-summary">

                    <div className="summary-card">

                        <span>
                            Total Records
                        </span>

                        <strong>
                            {attendance.length}
                        </strong>

                    </div>

                    <div className="summary-card present-summary">

                        <span>
                            Present
                        </span>

                        <strong>
                            {presentCount}
                        </strong>

                    </div>

                    <div className="summary-card absent-summary">

                        <span>
                            Absent
                        </span>

                        <strong>
                            {absentCount}
                        </strong>

                    </div>

                </div>
            )}

            {/* ERROR */}

            {error && (
                <div className="attendance-error">
                    {error}
                </div>
            )}
            {/* FILTER */}

            <div className="attendance-filter-card">

                <div className="filter-heading">
                    <div>
                        <h3>
                            Attendance Filter
                        </h3>

                        <p>
                            Select a date range to
                            view attendance.
                        </p>
                    </div>
                </div>

                <div className="attendance-filter-row">

                    <div className="filter-field">

                        <label>
                            From Date
                        </label>

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) =>
                                setFromDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="filter-field">

                        <label>
                            To Date
                        </label>

                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) =>
                                setToDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <button
                        className="apply-filter-btn"
                        onClick={handleFilter}
                    >
                        Apply Filter
                    </button>

                </div>

            </div>

            {/* ATTENDANCE TABLE */}

            <div className="attendance-table-card">

                <div className="attendance-table-header">

                    <div>
                        <h3>
                            Attendance Records
                        </h3>

                        <p>
                            {searched
                                ? "Filtered attendance records"
                                : "Current month attendance"}
                        </p>
                    </div>

                </div>

                {loading ? (

                    <div className="attendance-table-loading">
                        Loading attendance...
                    </div>

                ) : attendance.length === 0 ? (

                    <div className="attendance-no-data">

                        <h3>
                            No attendance records
                        </h3>

                        <p>
                            No attendance was found
                            for the selected date range.
                        </p>

                    </div>

                ) : (

                    <div className="attendance-table-wrapper">

                        <table className="attendance-table">

                            <thead>
                                <tr>
                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Marked At
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {attendance.map(
                                    (record) => (
                                        <tr
                                            key={
                                                record.attendanceId
                                            }
                                        >

                                            <td>
                                                {formatDate(
                                                    record.attendanceDate
                                                )}
                                            </td>

                                            <td>

                                                <span
                                                    className={`attendance-status-badge ${
                                                        record.status ===
                                                        "PRESENT"
                                                            ? "present"
                                                            : "absent"
                                                    }`}
                                                >
                                                    {record.status}
                                                </span>

                                            </td>

                                            <td>
                                                {formatDateTime(
                                                    record.markedAt
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}


// -----------------------------------------
// DATE FORMAT
// -----------------------------------------

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }

    const date = new Date(
        `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// -----------------------------------------
// DATE TIME FORMAT
// -----------------------------------------

function formatDateTime(dateTimeString) {

    if (!dateTimeString) {
        return "-";
    }

    const date = new Date(
        dateTimeString
    );

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}