import { useMemo, useState } from "react";

export default function FacultyStudents({ students, loading }) {

    const [search, setSearch] = useState("");

    const filteredStudents = useMemo(() => {

        const value = search.trim().toLowerCase();

        if (!value) {
            return students;
        }

        return students.filter((student) => {

            const name =
                student.studentName?.toLowerCase() || "";

            const email =
                student.email?.toLowerCase() || "";

            const phone =
                student.phoneNumber?.toString() || "";

            const studentClass =
                student.studentClass?.toLowerCase() || "";

            const section =
                student.studentSection?.toLowerCase() || "";

            return (
                name.includes(value) ||
                email.includes(value) ||
                phone.includes(value) ||
                studentClass.includes(value) ||
                section.includes(value)
            );
        });

    }, [students, search]);


    return (
        <div className="dashboard-panel faculty-students-panel">

            {/* Header */}

            <div className="panel-header">

                <div>

                    <h3>
                        Students
                    </h3>

                    <p>
                        Students assigned to you
                    </p>

                </div>

                <div className="student-count">

                    {students.length} Students

                </div>

            </div>


            {/* Search */}

            <div className="faculty-student-toolbar">

                <div className="faculty-student-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search by name, email or phone..."
                    />

                    {search && (
                        <button
                            onClick={() => setSearch("")}
                        >
                            ×
                        </button>
                    )}

                </div>

                <span className="student-result-count">
                    {filteredStudents.length} found
                </span>

            </div>


            {/* Loading */}

            {loading && (

                <div className="faculty-students-loading">
                    Loading students...
                </div>

            )}


            {/* Empty */}

            {!loading && filteredStudents.length === 0 && (

                <div className="faculty-students-empty">

                    <div className="faculty-empty-icon">
                        S
                    </div>

                    <h4>
                        No students found
                    </h4>

                    <p>
                        {search
                            ? "No students match your search."
                            : "No students have been assigned to you yet."
                        }
                    </p>

                </div>

            )}


            {/* Student List */}

            {!loading && filteredStudents.length > 0 && (

                <div className="faculty-students-table">

                    {/* Header */}

                    <div className="faculty-students-table-header">

                        <span>
                            Student
                        </span>

                        <span>
                            Email
                        </span>

                        <span>
                            Phone
                        </span>

                        <span>
                            Class
                        </span>

                        <span>
                            Section
                        </span>

                    </div>


                    {/* Rows */}

                    {filteredStudents.map((student) => (

                        <div
                            className="faculty-students-table-row"
                            key={student.studentId}
                        >

                            {/* Student */}

                            <div className="faculty-student-name">

                                <div className="faculty-student-avatar">

                                    {student.studentName
                                        ?.charAt(0)
                                        ?.toUpperCase() || "S"}

                                </div>

                                <div>

                                    <strong>
                                        {student.studentName}
                                    </strong>

                                    <span>
                                        Student ID:{" "}
                                        {student.studentId}
                                    </span>

                                </div>

                            </div>


                            {/* Email */}

                            <div className="faculty-student-detail">

                                {student.email || "—"}

                            </div>


                            {/* Phone */}

                            <div className="faculty-student-detail">

                                {student.phoneNumber || "—"}

                            </div>


                            {/* Class */}

                            <div className="faculty-student-detail">

                                {student.studentClass || "—"}

                            </div>


                            {/* Section */}

                            <div className="faculty-student-detail">

                                {student.studentSection || "—"}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}