package com.ramlokesh.attend_backend.controller;

import com.ramlokesh.attend_backend.dto.FacultyRequest;
import com.ramlokesh.attend_backend.entity.Faculty;
import com.ramlokesh.attend_backend.service.FacultyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final FacultyService facultyService;

    public AdminController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @PostMapping("/faculty")
    public ResponseEntity<Faculty> createFaculty(
            @Valid @RequestBody FacultyRequest request) {

        Faculty faculty = facultyService.createFaculty(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(faculty);
    }
    @GetMapping("/faculty")
    public ResponseEntity<List<Faculty>> getAllFaculty() {

        return ResponseEntity.ok(
                facultyService.getAllFaculty()
        );
    }


    // =====================================
    // GET FACULTY BY ID
    // =====================================

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<Faculty> getFacultyById(

            @PathVariable Long facultyId) {

        return ResponseEntity.ok(
                facultyService.getFacultyById(
                        facultyId
                )
        );
    }
}