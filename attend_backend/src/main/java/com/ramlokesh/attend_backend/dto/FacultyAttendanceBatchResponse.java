package com.ramlokesh.attend_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacultyAttendanceBatchResponse {

    private boolean status;

    private String message;

    private LocalDate attendanceDate;

    private Integer totalRecords;

    private List<FacultyAttendanceResponse> attendance;
}