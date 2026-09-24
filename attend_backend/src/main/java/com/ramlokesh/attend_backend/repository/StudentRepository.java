package com.ramlokesh.attend_backend.repository;

import com.ramlokesh.attend_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser_UserId(Long userId);
    List<Student> findByFaculty_FacultyId(Long facultyId);
}