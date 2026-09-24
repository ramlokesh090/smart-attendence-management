package com.ramlokesh.attend_backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacultyAttendanceRequest {

    @NotNull(message = "Faculty ID is required")
    private Long facultyId;


    @NotBlank(message = "Attendance status is required")
    private String status;
}