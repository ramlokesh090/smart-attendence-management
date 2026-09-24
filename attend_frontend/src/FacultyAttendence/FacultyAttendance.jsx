import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/FacultyAttendance.css";

const API_URL = "http://localhost:8081";

export default function FacultyAttendance() {

    const adminUserId = useSelector(
        (state) => state.auth.userId
    );

    const [faculty, setFaculty] = useState([]);

    const [attendance, setAttendance] = useState({});

    const [todayAttendance, setTodayAttendance] =
        useState([]);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    /*
     * Get today's date
     */
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


    const today = useMemo(
        () => getToday(),
        []
    );


    /*
     * Check whether attendance is already submitted
     */
    const fetchTodayAttendance = async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/admin/faculty-attendance?date=${today}`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch today's attendance"
                );
            }

            const data = await response.json();

            setTodayAttendance(data);

            return data;

        } catch (error) {

            console.error(
                "Today's attendance error:",
                error
            );

            throw error;
        }
    };


    /*
     * Get all faculty
     */
    const fetchFaculty = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                `${API_URL}/api/admin/faculty`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch faculty"
                );
            }

            const data = await response.json();

            setFaculty(data);


            /*
             * Check today's attendance
             */
            const todayData =
                await fetchTodayAttendance();


            /*
             * If today's attendance exists,
             * show submitted attendance.
             *
             * Otherwise open the form.
             */
            if (todayData.length > 0) {

                setTodayAttendance(todayData);

            } else {

                /*
                 * Initially all faculty are PRESENT.
                 */
                const initialAttendance = {};

                data.forEach((item) => {

                    initialAttendance[
                        item.facultyId
                    ] = "PRESENT";

                });

                setAttendance(
                    initialAttendance
                );
            }

        } catch (error) {

            console.error(
                "Faculty attendance loading error:",
                error
            );

            setError(
                "Unable to load faculty attendance."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchFaculty();

    }, []);


    /*
     * Change attendance
     */
    const handleAttendanceChange = (
        facultyId,
        status
    ) => {

        setAttendance((previous) => ({
            ...previous,
            [facultyId]: status
        }));
    };


    /*
     * Submit attendance
     */
    const handleSubmit = async () => {

        try {

            setSubmitting(true);

            setError("");

            setSuccess("");


            if (faculty.length === 0) {

                setError(
                    "No faculty members available."
                );

                return;
            }


            /*
             * Build attendance array
             */
            const attendanceList =
                faculty.map((item) => ({
                    facultyId: item.facultyId,
                    status:
                        attendance[item.facultyId] ||
                        "PRESENT"
                }));


            /*
             * Final request
             */
            const requestBody = {

                attendanceDate: today,

                attendance: attendanceList
            };


            const response = await fetch(
                `${API_URL}/api/admin/faculty-attendance?adminUserId=${adminUserId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        requestBody
                    )
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
                "Faculty attendance submitted successfully."
            );


            /*
             * IMPORTANT:
             * After submit, call GET API again.
             */
            const updatedAttendance =
                await fetchTodayAttendance();


            setTodayAttendance(
                updatedAttendance
            );

        } catch (error) {

            console.error(
                "Attendance submit error:",
                error
            );

            setError(
                error.message ||
                "Unable to submit attendance."
            );

        } finally {

            setSubmitting(false);
        }
    };


    /*
     * Convert API status to display
     */
    const getStatusClass = (status) => {

        return status === "PRESENT"
            ? "attendance-present"
            : "attendance-absent";
    };


    if (loading) {

        return (
            <div className="faculty-attendance-page">

                <div className="attendance-loading">
                    Loading faculty attendance...
                </div>

            </div>
        );
    }


    /*
     * Attendance already submitted today
     */
    const isSubmitted =
        todayAttendance.length > 0;


    return (
        <div className="faculty-attendance-page">


            {/* =================================
                PAGE HEADER
            ================================= */}

            <div className="page-header">

                {/* <div>

                    <span className="page-label">
                        ADMINISTRATION
                    </span>

                    <h2>
                        Faculty Attendance
                    </h2>

                    <p>
                        Mark and manage today's
                        faculty attendance.
                    </p>

                </div> */}

                <div className="attendance-date">

                    <span>
                        Attendance Date
                    </span>

                    <strong>
                        {today}
                    </strong>

                </div>

            </div>


            {/* =================================
                RULES
            ================================= */}

            <div className="attendance-rules">

                <div className="rules-icon">
                    i
                </div>

                <div>

                    <h4>
                        Attendance Rules
                    </h4>

                    <ul>

                        <li>
                            Faculty attendance can be
                            submitted only once per day.
                        </li>

                        <li>
                            Attendance opens at
                            <strong> 6:00 AM</strong>.
                        </li>

                        <li>
                            All faculty are initially
                            marked as Present.
                        </li>

                        <li>
                            Change a faculty to Absent
                            when required before submitting.
                        </li>

                        <li>
                            After submission, today's
                            attendance cannot be submitted
                            again.
                        </li>

                    </ul>

                </div>

            </div>


            {/* =================================
                SUCCESS / ERROR
            ================================= */}

            {success && (

                <div className="attendance-success">
                    {success}
                </div>

            )}

            {error && (

                <div className="attendance-error">
                    {error}
                </div>

            )}


            {/* =================================
                ALREADY SUBMITTED
            ================================= */}

            {isSubmitted ? (

                <div className="attendance-panel">

                    <div className="attendance-panel-header">

                        <div>

                            <h3>
                                Today's Attendance
                            </h3>

                            <p>
                                Attendance has already been
                                submitted for today.
                            </p>

                        </div>

                        <div className="submitted-badge">
                            Submitted
                        </div>

                    </div>


                    <div className="faculty-attendance-list">

                        {todayAttendance.map(
                            (item) => (

                                <div
                                    className="faculty-attendance-card submitted"
                                    key={item.attendanceId}
                                >

                                    <div className="faculty-card-left">

                                        <div className="faculty-avatar">

                                            {item.facultyName
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                                "F"}

                                        </div>

                                        <div>

                                            <strong>
                                                {item.facultyName}
                                            </strong>

                                            <span>
                                                Faculty ID:{" "}
                                                {item.facultyId}
                                            </span>

                                        </div>

                                    </div>


                                    <div
                                        className={
                                            `attendance-status-badge ${
                                                getStatusClass(
                                                    item.status
                                                )
                                            }`
                                        }
                                    >

                                        {item.status ===
                                        "PRESENT"
                                            ? "Present"
                                            : "Absent"}

                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    <div className="attendance-locked-message">

                        Today's faculty attendance
                        is locked after submission.
                        The next attendance window opens
                        at <strong>6:00 AM tomorrow.</strong>

                    </div>

                </div>

            ) : (

                /* =================================
                   ATTENDANCE FORM
                ================================= */

                <div className="attendance-panel">

                    <div className="attendance-panel-header">

                        <div>

                            <h3>
                                Mark Faculty Attendance
                            </h3>

                            <p>
                                Review each faculty member
                                and submit today's attendance.
                            </p>

                        </div>

                        <div className="faculty-total">

                            {faculty.length} Faculty

                        </div>

                    </div>


                    {/* Faculty list */}

                    <div className="faculty-attendance-list">

                        {faculty.map((item) => {

                            const currentStatus =
                                attendance[
                                    item.facultyId
                                ] || "PRESENT";


                            return (

                                <div
                                    className="faculty-attendance-card"
                                    key={item.facultyId}
                                >

                                    {/* Faculty information */}

                                    <div className="faculty-card-left">

                                        <div className="faculty-avatar">

                                            {item.firstName
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                                "F"}

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


                                    {/* Attendance selector */}

                                    <div className="attendance-selector">

                                        <button
                                            type="button"
                                            className={
                                                currentStatus ===
                                                "PRESENT"
                                                    ? "attendance-option present selected"
                                                    : "attendance-option present"
                                            }
                                            onClick={() =>
                                                handleAttendanceChange(
                                                    item.facultyId,
                                                    "PRESENT"
                                                )
                                            }
                                        >

                                            <span className="option-radio">
                                                ✓
                                            </span>

                                            Present

                                        </button>


                                        <button
                                            type="button"
                                            className={
                                                currentStatus ===
                                                "ABSENT"
                                                    ? "attendance-option absent selected"
                                                    : "attendance-option absent"
                                            }
                                            onClick={() =>
                                                handleAttendanceChange(
                                                    item.facultyId,
                                                    "ABSENT"
                                                )
                                            }
                                        >

                                            <span className="option-radio">
                                                ×
                                            </span>

                                            Absent

                                        </button>

                                    </div>

                                </div>

                            );
                        })}

                    </div>


                    {/* Submit */}

                    <div className="attendance-submit-area">

                        <div>

                            <strong>
                                Ready to submit?
                            </strong>

                            <span>
                                Review all faculty attendance
                                before submitting.
                            </span>

                        </div>

                        <button
                            type="button"
                            className="attendance-submit-button"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >

                            {submitting
                                ? "Submitting..."
                                : "Submit Attendance"
                            }

                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}