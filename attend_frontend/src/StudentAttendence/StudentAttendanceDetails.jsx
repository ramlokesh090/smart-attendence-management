import { useEffect, useState } from "react";
import "../styles/StudentAttendanceHistory.css";

const API_URL = "http://localhost:8081";

export default function StudentAttendanceDetails({
    student,
    onBack
}) {

    const getToday = () => {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const getFirstDayOfCurrentMonth = () => {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        return `${year}-${month}-01`;
    };

    const [fromDate, setFromDate] =
        useState(
            getFirstDayOfCurrentMonth()
        );

    const [toDate, setToDate] =
        useState(getToday());

    const [attendance, setAttendance] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        fetchAttendance(
            getFirstDayOfCurrentMonth(),
            getToday()
        );

    }, [student.studentId]);

    const fetchAttendance = async (
        startDate,
        endDate
    ) => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/faculty/student/${
                    student.studentId
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

            const data =
                await response.json();

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

        fetchAttendance(
            fromDate,
            toDate
        );
    };

    const presentCount =
        attendance.filter(
            (record) =>
                record.status === "PRESENT"
        ).length;

    const absentCount =
        attendance.filter(
            (record) =>
                record.status === "ABSENT"
        ).length;

    return (
        <div className="student-details-page">

            {/* BACK */}

            <div className="student-details-header">

                <button
                    className="student-back-button"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <div>
                    <h1>
                        Student Attendance
                    </h1>

                    <p>
                        Attendance history
                    </p>
                </div>

            </div>

            {/* STUDENT INFORMATION */}

            <div className="student-details-card">

                <div className="student-details-avatar">
                    {student.studentName
                        ?.charAt(0)
                        ?.toUpperCase()}
                </div>

                <div className="student-details-main">

                    <h2>
                        {student.studentName}
                    </h2>

                    <span>
                        Student ID:{" "}
                        {student.studentId}
                    </span>

                </div>

                <div className="student-details-info">

                    <div>
                        <span>Email</span>
                        <strong>
                            {student.email || "-"}
                        </strong>
                    </div>

                    <div>
                        <span>Class</span>
                        <strong>
                            {student.studentClass}
                        </strong>
                    </div>

                    <div>
                        <span>Section</span>
                        <strong>
                            {student.studentSection}
                        </strong>
                    </div>

                </div>

            </div>

            {/* FILTER */}

            <div className="student-attendance-filter">

                <div>

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

                <div>

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
                    onClick={handleFilter}
                >
                    Apply Filter
                </button>

            </div>

            {/* SUMMARY */}

            {!loading && !error && (

                <div className="student-attendance-summary">

                    <div>
                        <span>
                            Total Records
                        </span>

                        <strong>
                            {attendance.length}
                        </strong>
                    </div>

                    <div className="present">
                        <span>
                            Present
                        </span>

                        <strong>
                            {presentCount}
                        </strong>
                    </div>

                    <div className="absent">
                        <span>
                            Absent
                        </span>

                        <strong>
                            {absentCount}
                        </strong>
                    </div>

                </div>
            )}

            {error && (
                <div className="student-history-error">
                    {error}
                </div>
            )}

            {/* ATTENDANCE TABLE */}

            <div className="student-attendance-table-card">

                <div className="student-attendance-table-title">

                    <h3>
                        Attendance Records
                    </h3>

                    <p>
                        {fromDate} to {toDate}
                    </p>

                </div>

                {loading ? (

                    <div className="student-history-message">
                        Loading attendance...
                    </div>

                ) : attendance.length === 0 ? (

                    <div className="student-history-message">

                        <h3>
                            No attendance records
                        </h3>

                        <p>
                            No attendance found
                            for this date range.
                        </p>

                    </div>

                ) : (

                    <div className="student-attendance-table-wrapper">

                        <table className="student-attendance-table">

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
                                                    className={`student-status ${
                                                        record.status ===
                                                        "PRESENT"
                                                            ? "present"
                                                            : "absent"
                                                    }`}
                                                >
                                                    {
                                                        record.status
                                                    }
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