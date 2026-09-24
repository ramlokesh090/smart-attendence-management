package com.ramlokesh.attend_backend.controller;

import com.ramlokesh.attend_backend.dto.FacultyAttendanceBatchRequest;
import com.ramlokesh.attend_backend.dto.FacultyAttendanceBatchResponse;
import com.ramlokesh.attend_backend.dto.FacultyAttendanceResponse;
import com.ramlokesh.attend_backend.service.FacultyAttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class FacultyAttendanceController {

    private final FacultyAttendanceService attendanceService;


    public FacultyAttendanceController(
            FacultyAttendanceService attendanceService) {

        this.attendanceService =
                attendanceService;
    }


    // =========================================
    // MARK ATTENDANCE FOR MULTIPLE FACULTY
    // =========================================

    @PostMapping("/faculty-attendance")
    public ResponseEntity<FacultyAttendanceBatchResponse>
    markFacultyAttendance(

            @Valid
            @RequestBody
            FacultyAttendanceBatchRequest request,

            @RequestParam
            Long adminUserId) {


        FacultyAttendanceBatchResponse response =
                attendanceService.markAttendance(
                        request,
                        adminUserId
                );


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================
    // GET FACULTY ATTENDANCE BY DATE
    // =========================================

    @GetMapping("/faculty-attendance")
    public ResponseEntity<List<FacultyAttendanceResponse>>
    getAttendanceByDate(
            @RequestParam LocalDate date) {


        return ResponseEntity.ok(
                attendanceService
                        .getAttendanceByDate(date)
        );
    }


    // =========================================
    // GET PARTICULAR FACULTY ATTENDANCE
    // =========================================

    @GetMapping("/faculty/{facultyId}/attendance")
    public ResponseEntity<List<FacultyAttendanceResponse>>
    getFacultyAttendance(
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
}