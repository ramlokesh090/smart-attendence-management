import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./App";
import Login from "./login";
import Dashboard from "./Dashboard";

export default function RouterApp() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}