package com.ramlokesh.attend_backend.controller;

import com.ramlokesh.attend_backend.dto.StudentAttendanceBatchRequest;
import com.ramlokesh.attend_backend.dto.StudentAttendanceBatchResponse;
import com.ramlokesh.attend_backend.dto.StudentAttendanceResponse;
import com.ramlokesh.attend_backend.service.StudentAttendanceService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/faculty")
public class StudentAttendanceController {

    private final StudentAttendanceService attendanceService;

    public StudentAttendanceController(
            StudentAttendanceService attendanceService) {

        this.attendanceService =
                attendanceService;
    }

    // =====================================================
    // MARK STUDENT ATTENDANCE
    // =====================================================

    @PostMapping("/{facultyId}/student-attendance")
    public ResponseEntity<StudentAttendanceBatchResponse>
    markStudentAttendance(

            @PathVariable Long facultyId,

            @RequestParam Long facultyUserId,

            @Valid
            @RequestBody StudentAttendanceBatchRequest request) {

        StudentAttendanceBatchResponse response =
                attendanceService.markAttendance(
                        facultyId,
                        facultyUserId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =====================================================
    // GET TODAY ATTENDANCE
    // =====================================================

    @GetMapping("/{facultyId}/student-attendance")
    public ResponseEntity<List<StudentAttendanceResponse>>
    getAttendanceByDate(

            @PathVariable Long facultyId,

            @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                attendanceService
                        .getAttendanceByFacultyAndDate(
                                facultyId,
                                date
                        )
        );
    }

    // =====================================================
    // GET ATTENDANCE HISTORY
    // =====================================================

    @GetMapping("/{facultyId}/student-attendance/history")
    public ResponseEntity<List<StudentAttendanceResponse>>
    getAttendanceHistory(

            @PathVariable Long facultyId,

            @RequestParam LocalDate fromDate,

            @RequestParam LocalDate toDate) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByFaculty(
                        facultyId,
                        fromDate,
                        toDate
                )
        );
    }
    @GetMapping("/student/{studentId}/attendance")
    public ResponseEntity<List<StudentAttendanceResponse>>
    getStudentAttendance(
            @PathVariable Long studentId,
            @RequestParam LocalDate fromDate,
            @RequestParam LocalDate toDate) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByStudent(
                        studentId,
                        fromDate,
                        toDate
                )
        );
    }
}