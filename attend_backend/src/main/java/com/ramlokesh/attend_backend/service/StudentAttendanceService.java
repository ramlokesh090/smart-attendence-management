package com.ramlokesh.attend_backend.service;

import com.ramlokesh.attend_backend.dto.StudentAttendanceBatchRequest;
import com.ramlokesh.attend_backend.dto.StudentAttendanceBatchResponse;
import com.ramlokesh.attend_backend.dto.StudentAttendanceRequest;
import com.ramlokesh.attend_backend.dto.StudentAttendanceResponse;
import com.ramlokesh.attend_backend.entity.Faculty;
import com.ramlokesh.attend_backend.entity.Student;
import com.ramlokesh.attend_backend.entity.StudentAttendance;
import com.ramlokesh.attend_backend.entity.User;
import com.ramlokesh.attend_backend.repository.FacultyRepository;
import com.ramlokesh.attend_backend.repository.StudentAttendanceRepository;
import com.ramlokesh.attend_backend.repository.StudentRepository;
import com.ramlokesh.attend_backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class StudentAttendanceService {

    private final StudentAttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;

    public StudentAttendanceService(
            StudentAttendanceRepository attendanceRepository,
            StudentRepository studentRepository,
            FacultyRepository facultyRepository,
            UserRepository userRepository) {

        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // MARK ATTENDANCE
    // =====================================================

    @Transactional
    public StudentAttendanceBatchResponse markAttendance(
            Long facultyId,
            Long facultyUserId,
            StudentAttendanceBatchRequest request) {

        // -----------------------------------------
        // CHECK 6 AM
        // -----------------------------------------

        LocalTime currentTime =
                LocalTime.now(
                        ZoneId.of("Asia/Kolkata")
                );

        if (currentTime.isBefore(
                LocalTime.of(6, 0))) {

            throw new RuntimeException(
                    "Student attendance opens at 6:00 AM"
            );
        }

        // -----------------------------------------
        // FIND FACULTY
        // -----------------------------------------

        Faculty faculty =
                facultyRepository.findById(facultyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Faculty not found"
                                ));

        // -----------------------------------------
        // VERIFY FACULTY USER
        // -----------------------------------------

        User facultyUser =
                userRepository.findById(facultyUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Faculty user not found"
                                ));

        if (!"FACULTY".equalsIgnoreCase(
                facultyUser.getRole())) {

            throw new RuntimeException(
                    "Only faculty can mark student attendance"
            );
        }

        // -----------------------------------------
        // VERIFY USER BELONGS TO FACULTY
        // -----------------------------------------

        if (!faculty.getUser()
                .getUserId()
                .equals(facultyUserId)) {

            throw new RuntimeException(
                    "You are not authorized for this faculty"
            );
        }

        // -----------------------------------------
        // DUPLICATE STUDENT IDs
        // -----------------------------------------

        Set<Long> studentIds = new HashSet<>();

        for (StudentAttendanceRequest item :
                request.getAttendance()) {

            if (!studentIds.add(item.getStudentId())) {

                throw new RuntimeException(
                        "Duplicate student ID: "
                                + item.getStudentId()
                );
            }
        }

        // -----------------------------------------
        // CREATE ATTENDANCE
        // -----------------------------------------

        LocalDate attendanceDate =
                request.getAttendanceDate();

        List<StudentAttendance> records =
                request.getAttendance()
                        .stream()
                        .map(item -> {

                            Student student =
                                    studentRepository
                                            .findById(
                                                    item.getStudentId()
                                            )
                                            .orElseThrow(() ->
                                                    new RuntimeException(
                                                            "Student not found with id: "
                                                                    + item.getStudentId()
                                                    )
                                            );

                            // -----------------------------------------
                            // IMPORTANT:
                            // STUDENT MUST BELONG TO THIS FACULTY
                            // -----------------------------------------

                            if (!student.getFaculty()
                                    .getFacultyId()
                                    .equals(facultyId)) {

                                throw new RuntimeException(
                                        "Student "
                                                + item.getStudentId()
                                                + " does not belong to this faculty"
                                );
                            }

                            // -----------------------------------------
                            // CHECK ALREADY MARKED
                            // -----------------------------------------

                            if (attendanceRepository
                                    .existsByStudent_StudentIdAndAttendanceDate(
                                            item.getStudentId(),
                                            attendanceDate
                                    )) {

                                throw new RuntimeException(
                                        "Attendance already marked for student: "
                                                + item.getStudentId()
                                );
                            }

                            String status =
                                    item.getStatus()
                                            .trim()
                                            .toUpperCase();

                            if (!status.equals("PRESENT")
                                    && !status.equals("ABSENT")) {

                                throw new RuntimeException(
                                        "Invalid attendance status for student: "
                                                + item.getStudentId()
                                );
                            }

                            StudentAttendance attendance =
                                    new StudentAttendance();

                            attendance.setStudent(student);
                            attendance.setFaculty(faculty);
                            attendance.setAttendanceDate(
                                    attendanceDate
                            );
                            attendance.setStatus(status);
                            attendance.setMarkedAt(
                                    LocalDateTime.now(
                                            ZoneId.of("Asia/Kolkata")
                                    )
                            );
                            attendance.setMarkedBy(
                                    facultyUser
                            );

                            return attendance;

                        })
                        .toList();

        // -----------------------------------------
        // SAVE ALL
        // -----------------------------------------

        List<StudentAttendance> savedRecords =
                attendanceRepository.saveAll(records);

        // -----------------------------------------
        // RESPONSE
        // -----------------------------------------

        List<StudentAttendanceResponse> response =
                savedRecords.stream()
                        .map(this::mapToResponse)
                        .toList();

        return new StudentAttendanceBatchResponse(
                true,
                "Student attendance marked successfully",
                attendanceDate,
                response.size(),
                response
        );
    }

    // =====================================================
    // GET TODAY'S ATTENDANCE FOR FACULTY
    // =====================================================

    @Transactional
    public List<StudentAttendanceResponse>
    getAttendanceByFacultyAndDate(
            Long facultyId,
            LocalDate date) {

        facultyRepository.findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found"
                        ));

        return attendanceRepository
                .findByFaculty_FacultyIdAndAttendanceDateOrderByStudent_StudentId(
                        facultyId,
                        date
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =====================================================
    // GET ATTENDANCE BY DATE RANGE
    // =====================================================

    @Transactional
    public List<StudentAttendanceResponse>
    getAttendanceByFaculty(
            Long facultyId,
            LocalDate fromDate,
            LocalDate toDate) {

        facultyRepository.findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found"
                        ));

        if (fromDate.isAfter(toDate)) {

            throw new RuntimeException(
                    "From date cannot be after to date"
            );
        }

        return attendanceRepository
                .findByFaculty_FacultyIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
                        facultyId,
                        fromDate,
                        toDate
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =====================================================
    // MAP RESPONSE
    // =====================================================

    private StudentAttendanceResponse
    mapToResponse(
            StudentAttendance attendance) {

        return new StudentAttendanceResponse(
                attendance.getAttendanceId(),
                attendance.getStudent().getStudentId(),
                attendance.getStudent().getStudentName(),
                attendance.getFaculty().getFacultyId(),
                attendance.getAttendanceDate(),
                attendance.getStatus(),
                attendance.getMarkedAt(),
                attendance.getMarkedBy() != null
                        ? attendance.getMarkedBy().getUserId()
                        : null
        );
    }
    @Transactional
    public List<StudentAttendanceResponse> getAttendanceByStudent(
            Long studentId,
            LocalDate fromDate,
            LocalDate toDate) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: " + studentId
                        )
                );

        if (fromDate.isAfter(toDate)) {
            throw new RuntimeException(
                    "From date cannot be after to date"
            );
        }

        return attendanceRepository
                .findByStudent_StudentIdAndAttendanceDateBetweenOrderByAttendanceDateDesc(
                        studentId,
                        fromDate,
                        toDate
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
}