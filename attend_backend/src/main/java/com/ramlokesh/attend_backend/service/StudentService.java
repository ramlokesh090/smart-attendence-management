package com.ramlokesh.attend_backend.service;

import com.ramlokesh.attend_backend.dto.StudentRequest;
import com.ramlokesh.attend_backend.dto.StudentResponse;
import com.ramlokesh.attend_backend.entity.Faculty;
import com.ramlokesh.attend_backend.entity.Student;
import com.ramlokesh.attend_backend.entity.User;
import com.ramlokesh.attend_backend.repository.FacultyRepository;
import com.ramlokesh.attend_backend.repository.StudentRepository;
import com.ramlokesh.attend_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;

    public StudentService(
            UserRepository userRepository,
            StudentRepository studentRepository,
            FacultyRepository facultyRepository) {

        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
    }

    public Student createStudent(
            Long facultyId,
            StudentRequest request) {

        // 1. Find Faculty
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException("Faculty not found"));

        // 2. Create User
        User user = new User();

        user.setEmail(request.getEmail());
        user.setRole("STUDENT");

        // 3. Save User
        User savedUser = userRepository.save(user);

        // 4. Create Student
        Student student = new Student();

        student.setUser(savedUser);
        student.setFaculty(faculty);

        student.setStudentName(request.getStudentName());
        student.setStudentAge(request.getStudentAge());
        student.setStudentClass(request.getStudentClass());
        student.setStudentSection(request.getStudentSection());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setEmail(request.getEmail());
        // 5. Save Student
        return studentRepository.save(student);
    }
    public List<StudentResponse> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // ================================
    // GET STUDENT BY ID
    // ================================

    public StudentResponse getStudentById(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Student not found with id: " + studentId
                        )
                );

        return mapToResponse(student);
    }
    public List<StudentResponse> getStudentsByFacultyId(Long facultyId) {

        facultyRepository.findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found with id: " + facultyId
                        )
                );

        return studentRepository
                .findByFaculty_FacultyId(facultyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    private StudentResponse mapToResponse(Student student) {

        String facultyName =
                student.getFaculty().getFirstName()
                        + " "
                        + student.getFaculty().getLastName();

        return new StudentResponse(
                student.getStudentId(),
                student.getUser().getUserId(),
                student.getEmail(),
                student.getStudentName(),
                student.getStudentAge(),
                student.getStudentClass(),
                student.getStudentSection(),
                student.getPhoneNumber(),
                student.getFaculty().getFacultyId(),
                facultyName
        );
    }
}