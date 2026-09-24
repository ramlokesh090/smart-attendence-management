import { useSelector } from "react-redux";
import DashboardLayout from "./DashboardLayout";
import "./styles/Dashboard.css"

export default function Dashboard() {

    const role = useSelector(
        (state) => state.auth.role
    );

    return (
        <DashboardLayout role={role} />
    );
}