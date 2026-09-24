import { useState } from "react";
import "../styles/FacultyOnboarding.css";

const API_URL = "http://localhost:8081";

export default function FacultyOnboarding() {

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        age: "",
        department: "",
        className: "",
        sectionName: "",
        address: "",
        subject: "",
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

        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/api/admin/faculty`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...formData,
                        age: Number(formData.age),
                        phoneNumber: Number(formData.phoneNumber)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Unable to register faculty"
                );

                return;
            }

            setSuccess(
                "Faculty member registered successfully."
            );

            setFormData({
                email: "",
                firstName: "",
                lastName: "",
                age: "",
                department: "",
                className: "",
                sectionName: "",
                address: "",
                subject: "",
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


    return (
        <div className="faculty-onboarding-page">

            {/* Page Header */}

            {/* <div className="onboarding-page-header">

                <div>

                    <span className="onboarding-label">
                        ADMINISTRATION
                    </span>

                    <h2>
                        Faculty Onboarding
                    </h2>

                    <p>
                        Register a faculty member and assign
                        their academic responsibilities.
                    </p>

                </div>

            </div> */}


            {/* Form Card */}

            <div className="faculty-form-card">

                <div className="faculty-form-header">

                    <div>

                        <h3>
                            Faculty Information
                        </h3>

                        <p>
                            Enter the faculty member's
                            personal and academic details.
                        </p>

                    </div>

                    <div className="faculty-form-badge">
                        FACULTY
                    </div>

                </div>


                {/* Messages */}

                {success && (
                    <div className="form-success">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    {/* ================= PERSONAL ================= */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <h4>
                                Personal Details
                            </h4>

                            <span>
                                Basic information
                            </span>

                        </div>


                        <div className="faculty-form-grid">

                            <div className="faculty-field">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                    required
                                />

                            </div>


                            <div className="faculty-field">

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                    required
                                />

                            </div>


                            <div className="faculty-field">

                                <label>
                                    Age
                                </label>

                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Enter age"
                                    min="18"
                                    required
                                />

                            </div>


                            <div className="faculty-field">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />

                            </div>


                            <div className="faculty-field full-width">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter faculty email"
                                    required
                                />

                                <small>
                                    This email will be used for login.
                                </small>

                            </div>


                            <div className="faculty-field full-width">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter address"
                                    rows="3"
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* ================= ACADEMIC ================= */}

                    <div className="form-section">

                        <div className="form-section-title">

                            <h4>
                                Academic Assignment
                            </h4>

                            <span>
                                Faculty teaching details
                            </span>

                        </div>


                        <div className="faculty-form-grid">

                            <div className="faculty-field">

                                <label>
                                    Department
                                </label>

                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="e.g. Computer Science"
                                    required
                                />

                            </div>


                            <div className="faculty-field">

                                <label>
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="e.g. Java Programming"
                                    required
                                />

                            </div>


                            <div className="faculty-field">

                                <label>
                                    Class
                                </label>

                                <input
                                    type="text"
                                    name="className"
                                    value={formData.className}
                                    onChange={handleChange}
                                    placeholder="e.g. B.Tech CSE"
                                    required
                                />

                            </div>


                            <div className="faculty-field">

                                <label>
                                    Section
                                </label>

                                <input
                                    type="text"
                                    name="sectionName"
                                    value={formData.sectionName}
                                    onChange={handleChange}
                                    placeholder="e.g. A"
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* ================= ACTIONS ================= */}

                    <div className="faculty-form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {
                                setFormData({
                                    email: "",
                                    firstName: "",
                                    lastName: "",
                                    age: "",
                                    department: "",
                                    className: "",
                                    sectionName: "",
                                    address: "",
                                    subject: "",
                                    phoneNumber: ""
                                });

                                setError("");
                                setSuccess("");
                            }}
                        >
                            Clear
                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Registering..."
                                : "Register Faculty"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}