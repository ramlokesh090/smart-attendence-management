package com.ramlokesh.attend_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponse {

    private Long studentId;

    private Long userId;

    private String email;

    private String studentName;

    private Integer studentAge;

    private String studentClass;

    private String studentSection;

    private Long phoneNumber;

    private Long facultyId;

    private String facultyName;
}