import { useState } from "react";
import { useSelector } from "react-redux";
import "../styles/StudentOnboarding.css";

const API_URL = "http://localhost:8081";

export default function StudentOnboarding() {

    const facultyId = useSelector(
        (state) => state.auth.facultyId
    );

    const [formData, setFormData] = useState({
        email: "",
        studentName: "",
        studentAge: "",
        studentClass: "",
        studentSection: "",
        phoneNumber: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSuccess("");
        setError("");

        if (!facultyId) {
            setError("Faculty information is not available.");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/api/faculty/${facultyId}/students`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: formData.email.trim(),
                        studentName: formData.studentName.trim(),
                        studentAge: Number(formData.studentAge),
                        studentClass: formData.studentClass.trim(),
                        studentSection: formData.studentSection.trim(),
                        phoneNumber: Number(formData.phoneNumber)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Unable to register student."
                );

                return;
            }

            setSuccess(
                "Student registered successfully."
            );

            setFormData({
                email: "",
                studentName: "",
                studentAge: "",
                studentClass: "",
                studentSection: "",
                phoneNumber: ""
            });

        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);
        }
    };

    const handleClear = () => {

        setFormData({
            email: "",
            studentName: "",
            studentAge: "",
            studentClass: "",
            studentSection: "",
            phoneNumber: ""
        });

        setError("");
        setSuccess("");
    };


    return (
        <div className="student-onboarding-page">

            {/* ================= PAGE HEADER ================= */}

            {/* <div className="onboarding-page-header">

                <div>

                    <span className="onboarding-label">
                        STUDENT MANAGEMENT
                    </span>

                    <h2>
                        Student Onboarding
                    </h2>

                    <p>
                        Register a student and assign their
                        class and section details.
                    </p>

                </div>

            </div> */}


            {/* ================= FORM CARD ================= */}

            <div className="student-form-card">

                <div className="student-form-header">

                    <div>

                        <h3>
                            Student Information
                        </h3>

                        <p>
                            Enter the student's personal and
                            academic details.
                        </p>

                    </div>

                    <div className="student-form-badge">
                        STUDENT
                    </div>

                </div>


                {/* ================= MESSAGES ================= */}

                {success && (
                    <div className="student-form-success">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="student-form-error">
                        {error}
                    </div>
                )}


                <form
                    className="student-registration-form"
                    onSubmit={handleSubmit}
                >

                    {/* ================= PERSONAL DETAILS ================= */}

                    <div className="student-form-section">

                        <div className="student-section-title">

                            <h4>
                                Personal Details
                            </h4>

                            <span>
                                Student information
                            </span>

                        </div>


                        <div className="student-form-grid">

                            {/* Student Name */}

                            <div className="student-field">

                                <label htmlFor="studentName">
                                    Student Name
                                </label>

                                <input
                                    id="studentName"
                                    type="text"
                                    name="studentName"
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    placeholder="Enter student name"
                                    required
                                />

                            </div>


                            {/* Age */}

                            <div className="student-field">

                                <label htmlFor="studentAge">
                                    Age
                                </label>

                                <input
                                    id="studentAge"
                                    type="number"
                                    name="studentAge"
                                    value={formData.studentAge}
                                    onChange={handleChange}
                                    placeholder="Enter age"
                                    min="1"
                                    required
                                />

                            </div>


                            {/* Email */}

                            <div className="student-field full-width">

                                <label htmlFor="studentEmail">
                                    Email Address
                                </label>

                                <input
                                    id="studentEmail"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter student email"
                                    required
                                />

                                <small>
                                    This email will be used by the
                                    student to log in.
                                </small>

                            </div>


                            {/* Phone */}

                            <div className="student-field">

                                <label htmlFor="phoneNumber">
                                    Phone Number
                                </label>

                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* ================= ACADEMIC DETAILS ================= */}

                    <div className="student-form-section">

                        <div className="student-section-title">

                            <h4>
                                Academic Details
                            </h4>

                            <span>
                                Class and section assignment
                            </span>

                        </div>


                        <div className="student-form-grid">

                            {/* Class */}

                            <div className="student-field">

                                <label htmlFor="studentClass">
                                    Class
                                </label>

                                <input
                                    id="studentClass"
                                    type="text"
                                    name="studentClass"
                                    value={formData.studentClass}
                                    onChange={handleChange}
                                    placeholder="e.g. B.Tech CSE"
                                    required
                                />

                            </div>


                            {/* Section */}

                            <div className="student-field">

                                <label htmlFor="studentSection">
                                    Section
                                </label>

                                <input
                                    id="studentSection"
                                    type="text"
                                    name="studentSection"
                                    value={formData.studentSection}
                                    onChange={handleChange}
                                    placeholder="e.g. A"
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* ================= FACULTY INFO ================= */}

                    <div className="student-assignment-info">

                        <div className="assignment-info-icon">
                            i
                        </div>

                        <div>

                            <strong>
                                Faculty Assignment
                            </strong>

                            <p>
                                This student will be registered
                                under your faculty account.
                            </p>

                            <span>
                                Faculty ID: {facultyId || "Not available"}
                            </span>

                        </div>

                    </div>


                    {/* ================= ACTIONS ================= */}

                    <div className="student-form-actions">

                        <button
                            type="button"
                            className="student-secondary-button"
                            onClick={handleClear}
                        >
                            Clear
                        </button>

                        <button
                            type="submit"
                            className="student-primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Registering..."
                                : "Register Student"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}