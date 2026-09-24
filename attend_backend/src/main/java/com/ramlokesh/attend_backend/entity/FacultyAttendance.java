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
        name = "faculty_attendance",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_faculty_attendance_date",
                        columnNames = {
                                "faculty_id",
                                "attendance_date"
                        }
                )
        },
        indexes = {
                @Index(
                        name = "idx_faculty_attendance_date",
                        columnList = "attendance_date"
                ),
                @Index(
                        name = "idx_faculty_attendance_faculty_date",
                        columnList = "faculty_id, attendance_date"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacultyAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attendanceId;


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