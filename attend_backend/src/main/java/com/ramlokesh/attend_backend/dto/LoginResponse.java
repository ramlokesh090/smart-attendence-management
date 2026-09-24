package com.ramlokesh.attend_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    private boolean status;
    private String message;
    private Long userId;
    private String role;
    private Long facultyId;
    private Long studentId;
}