import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./styles/Signup.css";
import { loginSuccess } from "./redux/authSlice";

const API_URL = "https://smart-attendence-management.onrender.com";

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.status) {
                setError(data.message || "User not found");
                return;
            }

            const loginUser = {
                status: data.status,
                message: data.message,
                userId: data.userId,
                role: data.role,
                facultyId: data.facultyId,
                studentId: data.studentId,
                email: email.trim()
            };

            dispatch(loginSuccess(loginUser));

            localStorage.setItem(
                "user",
                JSON.stringify(loginUser)
            );

            navigate("/dashboard");

        } catch (error) {
            console.error(error);

            setError(
                "Unable to connect to the server"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* ================= HEADER ================= */}

            <header className="login-header-bar">

                <div
                    className="login-brand"
                    onClick={() => navigate("/")}
                >
                    <div className="brand-logo">
                        A
                    </div>

                    <div className="brand-text">
                        <strong>AttendEase</strong>
                        <span>Smart Attendance</span>
                    </div>   
                </div>

                <button
                    className="back-home"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>

            </header>


            {/* ================= MAIN ================= */}

            <main className="login-main">

                <div className="login-card">

                    <div className="login-card-header">

                        <div className="login-icon">
                            A
                        </div>

                        <h1>
                            Welcome back
                        </h1>

                        <p>
                            Sign in to your AttendEase account
                        </p>

                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="login-field">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                            />

                        </div>


                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}


                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Continue"
                            }
                        </button>

                    </form>


                    <div className="login-note">
                        For Admin login use this email - "admin@gmail.com"
                    </div>

                </div>

            </main>


            {/* ================= FOOTER ================= */}

            <footer className="login-footer">

                <span>
                    © 2026 AttendEase
                </span>

                <span>
                    Smart Attendance Management System
                </span>

            </footer>

        </div>
    );
}