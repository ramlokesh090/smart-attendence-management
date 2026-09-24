package com.ramlokesh.attend_backend.service;

import com.ramlokesh.attend_backend.dto.LoginRequest;
import com.ramlokesh.attend_backend.dto.LoginResponse;
import com.ramlokesh.attend_backend.entity.Faculty;
import com.ramlokesh.attend_backend.entity.Student;
import com.ramlokesh.attend_backend.entity.User;
import com.ramlokesh.attend_backend.repository.FacultyRepository;
import com.ramlokesh.attend_backend.repository.StudentRepository;
import com.ramlokesh.attend_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;

    public AuthService(
            UserRepository userRepository,
            FacultyRepository facultyRepository,
            StudentRepository studentRepository) {

        this.userRepository = userRepository;
        this.facultyRepository = facultyRepository;
        this.studentRepository = studentRepository;
    }

    public LoginResponse login(LoginRequest request) {

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        // User does not exist
        if (user == null) {
            return new LoginResponse(
                    false,
                    "User not found",
                    null,
                    null,
                    null,
                    null
            );
        }

        Long userId = user.getUserId();
        String role = user.getRole();

        // ADMIN
        if ("ADMIN".equalsIgnoreCase(role)) {

            return new LoginResponse(
                    true,
                    "Admin login successful",
                    userId,
                    role,
                    null,
                    null
            );
        }

        // FACULTY
        if ("FACULTY".equalsIgnoreCase(role)) {

            Faculty faculty = facultyRepository
                    .findByUser_UserId(userId)
                    .orElse(null);

            if (faculty == null) {
                return new LoginResponse(
                        false,
                        "Faculty details not found",
                        null,
                        null,
                        null,
                        null
                );
            }

            return new LoginResponse(
                    true,
                    "Faculty login successful",
                    userId,
                    role,
                    faculty.getFacultyId(),
                    null
            );
        }

        // STUDENT
        if ("STUDENT".equalsIgnoreCase(role)) {

            Student student = studentRepository
                    .findByUser_UserId(userId)
                    .orElse(null);

            if (student == null) {
                return new LoginResponse(
                        false,
                        "Student details not found",
                        null,
                        null,
                        null,
                        null
                );
            }

            return new LoginResponse(
                    true,
                    "Student login successful",
                    userId,
                    role,
                    student.getFaculty().getFacultyId(),
                    student.getStudentId()
            );
        }

        // Unknown role
        return new LoginResponse(
                false,
                "Invalid user role",
                null,
                null,
                null,
                null
        );
    }
}