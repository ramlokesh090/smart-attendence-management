package com.ramlokesh.attend_backend.repository;

import com.ramlokesh.attend_backend.entity.StudentAttendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface StudentAttendanceRepository
        extends JpaRepository<StudentAttendance, Long> {

    Optional<StudentAttendance>
    findByStudent_StudentIdAndAttendanceDate(
            Long studentId,
            LocalDate attendanceDate
    );

    List<StudentAttendance>
    findByFaculty_FacultyIdAndAttendanceDateOrderByStudent_StudentId(
            Long facultyId,
            LocalDate attendanceDate
    );

    List<StudentAttendance>
    findByStudent_StudentIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
            Long studentId,
            LocalDate fromDate,
            LocalDate toDate
    );

    List<StudentAttendance>
    findByFaculty_FacultyIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
            Long facultyId,
            LocalDate fromDate,
            LocalDate toDate
    );

    boolean existsByStudent_StudentIdAndAttendanceDate(
            Long studentId,
            LocalDate attendanceDate
    );
}