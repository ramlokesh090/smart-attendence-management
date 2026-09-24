package com.ramlokesh.attend_backend.service;

import com.ramlokesh.attend_backend.dto.FacultyAttendanceBatchRequest;
import com.ramlokesh.attend_backend.dto.FacultyAttendanceBatchResponse;
import com.ramlokesh.attend_backend.dto.FacultyAttendanceRequest;
import com.ramlokesh.attend_backend.dto.FacultyAttendanceResponse;
import com.ramlokesh.attend_backend.entity.Faculty;
import com.ramlokesh.attend_backend.entity.FacultyAttendance;
import com.ramlokesh.attend_backend.entity.User;
import com.ramlokesh.attend_backend.repository.FacultyAttendanceRepository;
import com.ramlokesh.attend_backend.repository.FacultyRepository;
import com.ramlokesh.attend_backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class FacultyAttendanceService {

    private final FacultyAttendanceRepository attendanceRepository;

    private final FacultyRepository facultyRepository;

    private final UserRepository userRepository;


    public FacultyAttendanceService(
            FacultyAttendanceRepository attendanceRepository,
            FacultyRepository facultyRepository,
            UserRepository userRepository) {

        this.attendanceRepository = attendanceRepository;

        this.facultyRepository = facultyRepository;

        this.userRepository = userRepository;
    }


    // =========================================
    // MARK FACULTY ATTENDANCE
    // =========================================

    @Transactional
    public FacultyAttendanceBatchResponse markAttendance(
            FacultyAttendanceBatchRequest request,
            Long adminUserId) {


        LocalDate attendanceDate =
                request.getAttendanceDate();


        List<FacultyAttendanceRequest> requests =
                request.getAttendance();


        // =========================================
        // 1. CHECK DUPLICATE FACULTY IDS
        // =========================================

        Set<Long> facultyIds =
                new HashSet<>();


        for (FacultyAttendanceRequest item : requests) {

            if (!facultyIds.add(item.getFacultyId())) {

                throw new RuntimeException(
                        "Duplicate faculty ID found: "
                                + item.getFacultyId()
                );
            }
        }


        // =========================================
        // 2. CHECK ADMIN
        // =========================================

        User admin = userRepository
                .findById(adminUserId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Admin user not found with id: "
                                        + adminUserId
                        )
                );


        // Make sure the user is actually admin

        if (!"ADMIN".equalsIgnoreCase(
                admin.getRole())) {

            throw new RuntimeException(
                    "Only admin can mark faculty attendance"
            );
        }


        // =========================================
        // 3. PRE-CHECK ALL ATTENDANCE
        // =========================================

        /*
         * We check everything BEFORE saving.
         *
         * This prevents a situation like:
         *
         * Faculty 1 -> saved
         * Faculty 2 -> saved
         * Faculty 3 -> duplicate error
         *
         * Because of @Transactional, the entire
         * operation will roll back if an error occurs.
         */

        for (FacultyAttendanceRequest item : requests) {

            boolean exists =
                    attendanceRepository
                            .existsByFaculty_FacultyIdAndAttendanceDate(
                                    item.getFacultyId(),
                                    attendanceDate
                            );

            if (exists) {

                throw new RuntimeException(
                        "Attendance already marked for faculty ID "
                                + item.getFacultyId()
                                + " on "
                                + attendanceDate
                );
            }
        }


        // =========================================
        // 4. CREATE ATTENDANCE RECORDS
        // =========================================

        List<FacultyAttendance> attendanceList =
                new ArrayList<>();


        for (FacultyAttendanceRequest item : requests) {


            // Find faculty

            Faculty faculty =
                    facultyRepository
                            .findById(item.getFacultyId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Faculty not found with id: "
                                                    + item.getFacultyId()
                                    )
                            );


            // Validate status

            String status =
                    item.getStatus()
                            .trim()
                            .toUpperCase();


            if (!status.equals("PRESENT")
                    && !status.equals("ABSENT")) {

                throw new RuntimeException(
                        "Invalid attendance status for faculty ID "
                                + item.getFacultyId()
                                + ". Allowed values: PRESENT, ABSENT"
                );
            }


            // Create entity

            FacultyAttendance attendance =
                    new FacultyAttendance();


            attendance.setFaculty(faculty);


            attendance.setAttendanceDate(
                    attendanceDate
            );


            attendance.setStatus(
                    status
            );


            attendance.setMarkedAt(
                    LocalDateTime.now()
            );


            attendance.setMarkedBy(
                    admin
            );


            attendanceList.add(
                    attendance
            );
        }


        // =========================================
        // 5. SAVE ALL
        // =========================================

        List<FacultyAttendance> savedAttendance =
                attendanceRepository.saveAll(
                        attendanceList
                );


        // =========================================
        // 6. CONVERT TO RESPONSE
        // =========================================

        List<FacultyAttendanceResponse> responses =
                savedAttendance
                        .stream()
                        .map(this::mapToResponse)
                        .toList();


        // =========================================
        // 7. RETURN RESPONSE
        // =========================================

        return new FacultyAttendanceBatchResponse(
                true,
                "Faculty attendance marked successfully",
                attendanceDate,
                responses.size(),
                responses
        );
    }


    // =========================================
    // GET ATTENDANCE BY DATE
    // =========================================

    @Transactional(readOnly = true)
    public List<FacultyAttendanceResponse>
    getAttendanceByDate(LocalDate date) {

        return attendanceRepository
                .findByAttendanceDateOrderByFaculty_FacultyId(
                        date
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================
    // GET FACULTY ATTENDANCE HISTORY
    // =========================================

    @Transactional(readOnly = true)
    public List<FacultyAttendanceResponse> getAttendanceByFaculty(
            Long facultyId,
            LocalDate fromDate,
            LocalDate toDate) {

        // Check faculty exists

        facultyRepository
                .findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found with id: "
                                        + facultyId
                        )
                );


        // Validate date range

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


    // =========================================
    // MAP ENTITY TO RESPONSE
    // =========================================

    private FacultyAttendanceResponse mapToResponse(
            FacultyAttendance attendance) {


        Faculty faculty =
                attendance.getFaculty();


        String facultyName =
                (
                        faculty.getFirstName()
                                + " "
                                + faculty.getLastName()
                ).trim();


        Long markedBy =
                attendance.getMarkedBy() != null
                        ? attendance.getMarkedBy().getUserId()
                        : null;


        return new FacultyAttendanceResponse(

                attendance.getAttendanceId(),

                faculty.getFacultyId(),

                facultyName,

                attendance.getAttendanceDate(),

                attendance.getStatus(),

                attendance.getMarkedAt(),

                markedBy
        );
    }
}