import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/FacultyMyAttendance.css";

const API_URL = "https://smart-attendence-management.onrender.com";

export default function FacultyMyAttendance() {

    const facultyId = useSelector(
        (state) => state.auth.facultyId
    );

    const [attendance, setAttendance] = useState([]);

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

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        if (facultyId) {
            fetchAttendance(
                getFirstDayOfCurrentMonth(),
                getToday()
            );
        }

    }, [facultyId]);

    const fetchAttendance = async (
        startDate,
        endDate
    ) => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/admin/faculty/${
                    facultyId
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
            (item) =>
                item.status === "PRESENT"
        ).length;

    const absentCount =
        attendance.filter(
            (item) =>
                item.status === "ABSENT"
        ).length;

    return (
        <div className="my-attendance-page">

            {/* HEADER */}

            {/* <div className="my-attendance-header">

                <div>
                    <h1>
                        My Attendance History
                    </h1>

                    <p>
                        View your faculty attendance
                        records.
                    </p>
                </div>

            </div> */}

            {/* FILTER */}

            <div className="my-attendance-filter">

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
                <div className="my-attendance-summary">

                    <div className="my-summary-card">
                        <span>
                            Total Records
                        </span>

                        <strong>
                            {attendance.length}
                        </strong>
                    </div>

                    <div className="my-summary-card present">
                        <span>
                            Present
                        </span>

                        <strong>
                            {presentCount}
                        </strong>
                    </div>

                    <div className="my-summary-card absent">
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
                <div className="my-attendance-error">
                    {error}
                </div>
            )}

            {/* TABLE */}

            <div className="my-attendance-table-card">

                <div className="my-attendance-table-title">

                    <h3>
                        Attendance Records
                    </h3>

                    <p>
                        Attendance from{" "}
                        {fromDate} to{" "}
                        {toDate}
                    </p>

                </div>

                {loading ? (

                    <div className="my-attendance-message">
                        Loading attendance...
                    </div>

                ) : attendance.length === 0 ? (

                    <div className="my-attendance-message">

                        <h3>
                            No attendance records
                        </h3>

                        <p>
                            No attendance was found
                            for the selected date
                            range.
                        </p>

                    </div>

                ) : (

                    <div className="my-attendance-table-wrapper">

                        <table className="my-attendance-table">

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
                                                    className={`my-attendance-badge ${
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