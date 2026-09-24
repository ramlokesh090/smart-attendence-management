package com.ramlokesh.attend_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentAttendanceResponse {

    private Long attendanceId;

    private Long studentId;

    private String studentName;

    private Long facultyId;

    private LocalDate attendanceDate;

    private String status;

    private LocalDateTime markedAt;

    private Long markedBy;
}