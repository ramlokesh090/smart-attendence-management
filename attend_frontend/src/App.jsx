import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-page">

            {/* Background 3D shapes */}
            <div className="shape shape-one"></div>
            <div className="shape shape-two"></div>
            <div className="shape shape-three"></div>

            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">
                    <div className="logo-icon">A</div>
                    <span>AttendEase</span>
                </div>

                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#features">Features</a>
                    <a href="#about">About</a>
                </div>

                <button
                    className="nav-login"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
            </nav>

            {/* Hero Section */}
            <main className="hero-section">

                {/* Left Content */}
                <section className="hero-content">

                    <div className="badge">
                        Smart • Simple • Secure
                    </div>

                    <h1>
                        Smart Attendance
                        <span> Management System</span>
                    </h1>

                    <p>
                        Manage faculty, students and attendance from one
                        simple platform. Track attendance efficiently and
                        keep everything organized.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="get-started"
                            onClick={() => navigate("/signup")}
                        >
                            Get Started
                            <span>→</span>
                        </button>

                        <button className="learn-more">
                            Learn More
                        </button>

                    </div>

                    <div className="hero-stats">
                        <div>
                            <strong>Easy</strong>
                            <span>Management</span>
                        </div>

                        <div>
                            <strong>Fast</strong>
                            <span>Attendance</span>
                        </div>

                        <div>
                            <strong>Smart</strong>
                            <span>Tracking</span>
                        </div>
                    </div>

                </section>

                {/* 3D Illustration */}
                <section className="hero-visual">

                    <div className="dashboard-card">

                        <div className="dashboard-top">
                            <div>
                                <span>Attendance</span>
                                <h3>Today's Overview</h3>
                            </div>

                            <div className="status-dot"></div>
                        </div>

                        <div className="attendance-circle">
                            <div className="circle-inner">
                                <strong>87%</strong>
                                <span>Present</span>
                            </div>
                        </div>

                        <div className="attendance-info">

                            <div className="info-card">
                                <div className="info-icon students-icon">
                                    👨‍🎓
                                </div>

                                <div>
                                    <strong>120</strong>
                                    <span>Students</span>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="info-icon faculty-icon">
                                    👨‍🏫
                                </div>

                                <div>
                                    <strong>12</strong>
                                    <span>Faculty</span>
                                </div>
                            </div>

                        </div>

                        <div className="progress-section">
                            <div className="progress-header">
                                <span>Weekly Attendance</span>
                                <strong>87%</strong>
                            </div>

                            <div className="progress-bar">
                                <div className="progress-value"></div>
                            </div>
                        </div>

                    </div>

                    {/* Floating cards */}

                    <div className="floating-card floating-card-one">
                        <div className="check-icon">✓</div>
                        <div>
                            <strong>Attendance Marked</strong>
                            <span>Today, 10:30 AM</span>
                        </div>
                    </div>

                    <div className="floating-card floating-card-two">
                        <span className="floating-number">94%</span>
                        <span>Class Attendance</span>
                    </div>

                </section>

            </main>

            {/* Features */}
            <section className="features-section" id="features">

                <div className="section-heading">
                    <span>WHY ATTENDEASE</span>
                    <h2>Everything you need to manage attendance</h2>
                </div>

                <div className="features-grid">

                    <div className="feature-card">
                        <div className="feature-icon">👨‍🏫</div>
                        <h3>Faculty Management</h3>
                        <p>
                            Admin can create faculty accounts and assign
                            departments, classes, sections and subjects.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🎓</div>
                        <h3>Student Management</h3>
                        <p>
                            Faculty can easily register and manage students
                            belonging to their assigned class.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Attendance Tracking</h3>
                        <p>
                            Record attendance and monitor student attendance
                            efficiently.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}