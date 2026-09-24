package com.ramlokesh.attend_backend.repository;

import com.ramlokesh.attend_backend.entity.FacultyAttendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FacultyAttendanceRepository
        extends JpaRepository<FacultyAttendance, Long> {


    Optional<FacultyAttendance>
    findByFaculty_FacultyIdAndAttendanceDate(
            Long facultyId,
            LocalDate attendanceDate
    );


    List<FacultyAttendance>
    findByAttendanceDateOrderByFaculty_FacultyId(
            LocalDate attendanceDate
    );


    List<FacultyAttendance>
    findByFaculty_FacultyIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
            Long facultyId,
            LocalDate fromDate,
            LocalDate toDate
    );


    boolean existsByFaculty_FacultyIdAndAttendanceDate(
            Long facultyId,
            LocalDate attendanceDate
    );
}