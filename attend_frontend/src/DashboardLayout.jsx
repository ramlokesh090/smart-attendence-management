import { useState } from "react";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import "./styles/Dashboard.css";

import AdminOverview from "./overview/AdminOverview";
import FacultyOverview from "./overview/FacultyOverview";
import StudentOverview from "./overview/StudentOverview";

import FacultyOnboarding from "./Onboarding/FacultyOnboarding";
import StudentOnboarding from "./Onboarding/StudentOnboarding";
import FacultyAttendance from "./FacultyAttendence/FacultyAttendance";
import FacultyAttendanceHistory from "./FacultyAttendence/FacultyAttendanceHistory";
import FacultyMyAttendance from "./FacultyAttendence/FacultyMyAttendance";
import StudentAttendance from "./StudentAttendence/StudentAttendance";
import StudentAttendanceHistory from "./StudentAttendence/StudentAttendanceHistory";
import StudentMyAttendance from "./StudentAttendence/StudentMyAttendance";
export default function DashboardLayout({ role }) {
  const [activePage, setActivePage] = useState("overview");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (page) => {
    setActivePage(page);

    // Close sidebar after navigation
    setSidebarOpen(false);
  };

  const renderContent = () => {
    /* ================= ADMIN ================= */

    if (role === "ADMIN") {
      if (activePage === "faculty") {
        return <FacultyOnboarding />;
      }

      if (activePage === "faculty-attendance") {
        return <FacultyAttendance />;
      }

      if (activePage === "faculty-attendance-history") {
        return <FacultyAttendanceHistory />;
      }

      return <AdminOverview />;
    }
    /* ================= FACULTY ================= */

    if (role === "FACULTY") {
      if (activePage === "student") {
        return <StudentOnboarding />;
      }
      if (activePage === "my-attendance") {
        return <FacultyMyAttendance />;
      }
      if (activePage === "student-attendance") {
        return <StudentAttendance />;
      }
      if (activePage === "student-attendance-history") {
        return <StudentAttendanceHistory />;
      }
      return <FacultyOverview />;
    }

    /* ================= STUDENT ================= */

    if (role === "STUDENT") {
      if (activePage === "student-attendance-history") {
        return <StudentMyAttendance />;
      }

      return <StudentOverview />;
    }

    return (
      <div className="empty-dashboard">
        <h2>Invalid User</h2>
        <p>Unable to determine the user role.</p>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        role={role}
        activePage={activePage}
        sidebarOpen={sidebarOpen}
        onNavigate={handleNavigation}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dashboard-main">
        <DashboardHeader role={role} onMenuClick={() => setSidebarOpen(true)} />

        <main className="dashboard-content">{renderContent()}</main>
      </div>
    </div>
  );
}
