package com.ramlokesh.attend_backend.repository;

import com.ramlokesh.attend_backend.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByUser_UserId(Long userId);

}