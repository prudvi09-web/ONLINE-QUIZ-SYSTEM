package com.quiz.system.controller;

import com.quiz.system.dto.DashboardStatsDto;
import com.quiz.system.dto.QuizResultDto;
import com.quiz.system.service.QuizAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminDashboardController {

    @Autowired
    private QuizAttemptService quizAttemptService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(quizAttemptService.getDashboardStats());
    }

    @GetMapping("/attempts")
    public ResponseEntity<List<QuizResultDto>> getAllAttempts() {
        return ResponseEntity.ok(quizAttemptService.getAllAttempts());
    }
}
