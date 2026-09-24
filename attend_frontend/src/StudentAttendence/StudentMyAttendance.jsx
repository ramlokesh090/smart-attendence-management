import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/StudentMyAttendance.css";

export default function StudentMyAttendance() {

    const studentId = useSelector(
        (state) => state.auth.studentId
    );

    const email = useSelector(
        (state) => state.auth.email
    );

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


    const getFirstDayOfMonth = () => {

        const today = new Date();

        const year = today.getFullYear();
        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        return `${year}-${month}-01`;
    };


    const [fromDate, setFromDate] = useState(
        getFirstDayOfMonth()
    );

    const [toDate, setToDate] = useState(
        getToday()
    );

    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    const fetchAttendance = async () => {

        if (!studentId) {
            return;
        }

        if (fromDate > toDate) {

            setError(
                "From date cannot be after To date."
            );

            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `https://smart-attendence-management.onrender.com/api/faculty/student/${studentId}/attendance?fromDate=${fromDate}&toDate=${toDate}`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch attendance"
                );
            }

            const data = await response.json();

            setAttendance(data);

        } catch (error) {

            console.error(
                "Error fetching attendance:",
                error
            );

            setError(
                "Unable to load attendance."
            );

            setAttendance([]);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchAttendance();

    }, [studentId]);


    const presentCount = attendance.filter(
        (item) =>
            item.status?.toUpperCase() === "PRESENT"
    ).length;


    const absentCount = attendance.filter(
        (item) =>
            item.status?.toUpperCase() === "ABSENT"
    ).length;


    return (

        <div className="student-attendance-page">

            {/* Header */}

            {/* <div className="page-header">

                <div>

                    <span className="page-label">
                        STUDENT
                    </span>

                    <h2>
                        My Attendance History
                    </h2>

                    <p>
                        View your attendance records
                        and attendance summary.
                    </p>

                </div>

            </div> */}


            {/* Student Card */}

            <div className="student-attendance-profile">

                <div className="student-profile-avatar">

                    {email
                        ? email.charAt(0).toUpperCase()
                        : "S"}

                </div>

                <div>

                    <h3>
                        My Attendance
                    </h3>

                    <p>
                        Student ID: {studentId || "—"}
                    </p>

                </div>

            </div>


            {/* Date Filter */}

            <div className="attendance-filter-card">

                <div className="filter-item">

                    <label>
                        From Date
                    </label>

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) =>
                            setFromDate(e.target.value)
                        }
                    />

                </div>


                <div className="filter-item">

                    <label>
                        To Date
                    </label>

                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) =>
                            setToDate(e.target.value)
                        }
                    />

                </div>


                <button
                    className="attendance-filter-button"
                    onClick={fetchAttendance}
                >
                    View Attendance
                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="attendance-error">
                    {error}
                </div>

            )}


            {/* Summary */}

            <div className="attendance-summary-grid">

                <div className="attendance-summary-card">

                    <span>
                        Total
                    </span>

                    <strong>
                        {loading
                            ? "..."
                            : attendance.length}
                    </strong>

                    <p>
                        Attendance records
                    </p>

                </div>


                <div className="attendance-summary-card">

                    <span>
                        Present
                    </span>

                    <strong>
                        {loading
                            ? "..."
                            : presentCount}
                    </strong>

                    <p>
                        Classes attended
                    </p>

                </div>


                <div className="attendance-summary-card">

                    <span>
                        Absent
                    </span>

                    <strong>
                        {loading
                            ? "..."
                            : absentCount}
                    </strong>

                    <p>
                        Classes missed
                    </p>

                </div>

            </div>


            {/* Attendance Table */}

            <div className="dashboard-panel">

                <div className="panel-header">

                    <div>

                        <h3>
                            Attendance Records
                        </h3>

                        <p>
                            Attendance between selected dates
                        </p>

                    </div>

                </div>


                {loading ? (

                    <div className="attendance-empty">
                        Loading attendance...
                    </div>

                ) : attendance.length === 0 ? (

                    <div className="attendance-empty">
                        No attendance records found.
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
                                                {record.attendanceDate}
                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        record.status?.toUpperCase() ===
                                                        "PRESENT"
                                                            ? "attendance-status present"
                                                            : "attendance-status absent"
                                                    }
                                                >
                                                    {
                                                        record.status
                                                    }
                                                </span>

                                            </td>


                                            <td>
                                                {record.markedAt
                                                    ? new Date(
                                                        record.markedAt
                                                    ).toLocaleString()
                                                    : "—"}
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