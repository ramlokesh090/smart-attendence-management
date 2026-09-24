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
public class FacultyRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotNull
    private Integer age;

    @NotBlank
    private String department;

    @NotBlank
    private String className;

    @NotBlank
    private String sectionName;

    @NotBlank
    private String address;

    @NotBlank
    private String subject;

    @NotNull
    private Long phoneNumber;

    // getters and setters
}