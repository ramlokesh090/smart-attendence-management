package com.ramlokesh.attend_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotNull(message = "Student age is required")
    private Integer studentAge;

    @NotBlank(message = "Student class is required")
    private String studentClass;

    @NotBlank(message = "Student section is required")
    private String studentSection;

    @NotNull(message = "Phone number is required")
    private Long phoneNumber;
}