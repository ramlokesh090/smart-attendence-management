import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "./redux/authSlice";
import "./styles/Dashboard.css";
export default function Sidebar({
  role,
  activePage,
  sidebarOpen,
  onNavigate,
  onClose,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNavigation = (page) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside
        className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">A</div>

            <div className="sidebar-brand-text">
              <strong>AttendEase</strong>
              <span>Attendance System</span>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-navigation">
          <div className="sidebar-section">
            <span>MAIN</span>
          </div>

          {/* Overview */}
          <button
            className={`sidebar-menu-item ${
              activePage === "overview" ? "active" : ""
            }`}
            onClick={() => handleNavigation("overview")}
          >
            <span className="menu-icon">◉</span>

            <span>Overview</span>
          </button>

          {/* ADMIN */}
          {/* ADMIN */}
          {role === "ADMIN" && (
            <>
              <div className="sidebar-section">
                <span>ADMINISTRATION</span>
              </div>

              {/* Faculty Onboarding */}
              <button
                className={`sidebar-menu-item ${
                  activePage === "faculty" ? "active" : ""
                }`}
                onClick={() => handleNavigation("faculty")}
              >
                <span className="menu-icon">+</span>
                <span>Faculty Onboarding</span>
              </button>

              {/* Faculty Attendance */}
              <button
                className={`sidebar-menu-item ${
                  activePage === "faculty-attendance" ? "active" : ""
                }`}
                onClick={() => handleNavigation("faculty-attendance")}
              >
                <span className="menu-icon">✓</span>
                <span>Faculty Attendance</span>
              </button>

              {/* Faculty Attendance History */}
              <button
                className={`sidebar-menu-item ${
                  activePage === "faculty-attendance-history" ? "active" : ""
                }`}
                onClick={() => handleNavigation("faculty-attendance-history")}
              >
                <span className="menu-icon">▣</span>
                <span>Attendance History</span>
              </button>
            </>
          )}
          {/*STUDENT*/}
          {role === "STUDENT" && (
            <>
              <div className="sidebar-section">
                <span>ATTENDANCE</span>
              </div>

              <button
                className={`sidebar-menu-item ${
                  activePage === "student-attendance-history" ? "active" : ""
                }`}
                onClick={() => handleNavigation("student-attendance-history")}
              >
                <span className="menu-icon">▣</span>

                <span>My Attendance History</span>
              </button>
            </>
          )}
          {/* FACULTY */}
          {role === "FACULTY" && (
            <>
              <div className="sidebar-section">
                <span>MANAGEMENT</span>
              </div>

              <button
                className={`sidebar-menu-item ${
                  activePage === "student" ? "active" : ""
                }`}
                onClick={() => handleNavigation("student")}
              >
                <span className="menu-icon">+</span>

                <span>Student Onboarding</span>
              </button>
              <button
                className={`sidebar-menu-item ${
                  activePage === "my-attendance" ? "active" : ""
                }`}
                onClick={() => handleNavigation("my-attendance")}
              >
                <span className="menu-icon">▣</span>
                <span>My Attendance History</span>
              </button>
              <button
                className={`sidebar-menu-item ${
                  activePage === "student-attendance" ? "active" : ""
                }`}
                onClick={() => handleNavigation("student-attendance")}
              >
                <span className="menu-icon">✓</span>
                <span>Student Attendance</span>
              </button>
              <button
                className={`sidebar-menu-item ${
                  activePage === "student-attendance-history" ? "active" : ""
                }`}
                onClick={() => handleNavigation("student-attendance-history")}
              >
                <span className="menu-icon">▣</span>
                <span>Student Attendance History</span>
              </button>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button className="sidebar-logout" onClick={handleLogout}>
            <span className="menu-icon">↪</span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
