package com.quiz.system.controller;

import com.quiz.system.dto.LeaderboardDto;
import com.quiz.system.dto.QuizResultDto;
import com.quiz.system.dto.QuizSubmitRequest;
import com.quiz.system.service.QuizAttemptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attempts")
public class QuizAttemptController {

    @Autowired
    private QuizAttemptService quizAttemptService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(@RequestBody QuizSubmitRequest request) {
        try {
            QuizResultDto result = quizAttemptService.submitQuiz(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttemptById(@PathVariable Long id) {
        try {
            QuizResultDto result = quizAttemptService.getAttemptById(id);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-history")
    public ResponseEntity<?> getMyAttempts() {
        try {
            List<QuizResultDto> history = quizAttemptService.getCurrentUserAttempts();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardDto>> getLeaderboard() {
        return ResponseEntity.ok(quizAttemptService.getLeaderboard());
    }
}
