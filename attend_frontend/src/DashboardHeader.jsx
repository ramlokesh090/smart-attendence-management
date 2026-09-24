import { useSelector } from "react-redux";

export default function DashboardHeader({
    role,
    onMenuClick
}) {
    const email = useSelector(
        (state) => state.auth.email
    );

    const getInitial = () => {
        if (!email) return "U";

        return email
            .charAt(0)
            .toUpperCase();
    };

    return (
        <header className="dashboard-header">

            {/* Left */}
            <div className="dashboard-header-left">

                {/* Mobile Menu */}
                <button
                    className="mobile-menu-button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className="header-title">

                    <h1>Dashboard</h1>

                    <p>
                        Welcome back to AttendEase
                    </p>

                </div>

            </div>


            {/* Right */}
            <div className="dashboard-header-right">

                <div className="header-profile">

                    <div className="header-avatar">
                        {getInitial()}
                    </div>

                    <div className="header-profile-info">

                        <strong>
                            {role || "User"}
                        </strong>

                        <span>
                            {email || "User account"}
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}