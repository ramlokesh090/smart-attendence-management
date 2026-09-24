package com.ramlokesh.attend_backend.service;

import com.ramlokesh.attend_backend.dto.FacultyRequest;
import com.ramlokesh.attend_backend.entity.Faculty;
import com.ramlokesh.attend_backend.entity.User;
import com.ramlokesh.attend_backend.repository.FacultyRepository;
import com.ramlokesh.attend_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacultyService {

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;

    public FacultyService(
            UserRepository userRepository,
            FacultyRepository facultyRepository) {

        this.userRepository = userRepository;
        this.facultyRepository = facultyRepository;
    }

    public Faculty createFaculty(FacultyRequest request) {

        // 1. Create User
        User user = new User();

        user.setEmail(request.getEmail());
        user.setRole("FACULTY");

        // 2. Save User
        User savedUser = userRepository.save(user);

        // 3. Create Faculty
        Faculty faculty = new Faculty();

        faculty.setUser(savedUser);
        faculty.setFirstName(request.getFirstName());
        faculty.setLastName(request.getLastName());
        faculty.setAge(request.getAge());
        faculty.setDepartment(request.getDepartment());
        faculty.setClassName(request.getClassName());
        faculty.setSectionName(request.getSectionName());
        faculty.setAddress(request.getAddress());
        faculty.setSubject(request.getSubject());
        faculty.setPhoneNumber(request.getPhoneNumber());
        faculty.setEmail(request.getEmail());

        // 4. Save Faculty
        return facultyRepository.save(faculty);
    }
    public List<Faculty> getAllFaculty() {

        return facultyRepository.findAll();
    }


// ================================
// GET FACULTY BY ID
// ================================

    public Faculty getFacultyById(Long facultyId) {

        return facultyRepository
                .findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found with id: "
                                        + facultyId
                        )
                );
    }
}