package com.ramlokesh.attend_backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class FacultyAttendanceBatchRequest {

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;


    @NotEmpty(message = "Attendance list cannot be empty")
    @Valid
    private List<FacultyAttendanceRequest> attendance;
}