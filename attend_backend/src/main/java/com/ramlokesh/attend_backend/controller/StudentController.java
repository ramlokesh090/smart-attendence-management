package com.ramlokesh.attend_backend.controller;

import com.ramlokesh.attend_backend.dto.StudentRequest;
import com.ramlokesh.attend_backend.dto.StudentResponse;
import com.ramlokesh.attend_backend.entity.Student;
import com.ramlokesh.attend_backend.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // =====================================
    // CREATE STUDENT
    // =====================================

    @PostMapping("/faculty/{facultyId}/students")
    public ResponseEntity<Student> createStudent(
            @PathVariable Long facultyId,
            @Valid @RequestBody StudentRequest request) {

        Student student =
                studentService.createStudent(facultyId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(student);
    }


    // =====================================
    // GET ALL STUDENTS
    // =====================================

    @GetMapping("/students")
    public ResponseEntity<List<StudentResponse>> getAllStudents() {

        return ResponseEntity.ok(
                studentService.getAllStudents()
        );
    }


    // =====================================
    // GET STUDENT BY ID
    // =====================================

    @GetMapping("/students/{studentId}")
    public ResponseEntity<StudentResponse> getStudentById(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                studentService.getStudentById(studentId)
        );
    }


    // =====================================
    // GET STUDENTS BY FACULTY ID
    // =====================================

    @GetMapping("/faculty/{facultyId}/students")
    public ResponseEntity<List<StudentResponse>> getStudentsByFacultyId(
            @PathVariable Long facultyId) {

        return ResponseEntity.ok(
                studentService.getStudentsByFacultyId(facultyId)
        );
    }
}