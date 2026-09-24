package com.ramlokesh.attend_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "student_attendance",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_student_attendance_date",
                        columnNames = {
                                "student_id",
                                "attendance_date"
                        }
                )
        },
        indexes = {
                @Index(
                        name = "idx_student_attendance_date",
                        columnList = "attendance_date"
                ),
                @Index(
                        name = "idx_student_attendance_student_date",
                        columnList = "student_id, attendance_date"
                ),
                @Index(
                        name = "idx_student_attendance_faculty_date",
                        columnList = "faculty_id, attendance_date"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "faculty_id",
            nullable = false
    )
    private Faculty faculty;

    @Column(
            name = "attendance_date",
            nullable = false
    )
    private LocalDate attendanceDate;

    @Column(
            nullable = false,
            length = 20
    )
    private String status;

    @Column(
            name = "marked_at",
            nullable = false
    )
    private LocalDateTime markedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marked_by")
    private User markedBy;
}