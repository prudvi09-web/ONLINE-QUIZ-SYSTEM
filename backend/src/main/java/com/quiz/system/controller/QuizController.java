package com.quiz.system.controller;

import com.quiz.system.dto.QuestionAdminDto;
import com.quiz.system.dto.QuizAdminDto;
import com.quiz.system.dto.QuizDto;
import com.quiz.system.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/active")
    public ResponseEntity<List<QuizDto>> getActiveQuizzes() {
        return ResponseEntity.ok(quizService.getAllActiveQuizzes());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<QuizDto>> getActiveQuizzesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(quizService.getActiveQuizzesByCategory(categoryId));
    }

    @GetMapping("/{id}/take")
    public ResponseEntity<?> getQuizForTaking(@PathVariable Long id) {
        try {
            QuizDto quiz = quizService.getQuizForTaking(id);
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<QuizAdminDto>> getAllQuizzesForAdmin() {
        return ResponseEntity.ok(quizService.getAllQuizzesForAdmin());
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getQuizForAdmin(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quizService.getQuizForAdmin(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createQuiz(@RequestBody QuizAdminDto dto) {
        try {
            QuizAdminDto created = quizService.createQuiz(dto);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateQuiz(@PathVariable Long id, @RequestBody QuizAdminDto dto) {
        try {
            QuizAdminDto updated = quizService.updateQuiz(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        try {
            quizService.deleteQuiz(id);
            return ResponseEntity.ok(Map.of("message", "Quiz deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{quizId}/questions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> addQuestion(@PathVariable Long quizId, @RequestBody QuestionAdminDto dto) {
        try {
            QuestionAdminDto created = quizService.addQuestion(quizId, dto);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/questions/{questionId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateQuestion(@PathVariable Long questionId, @RequestBody QuestionAdminDto dto) {
        try {
            QuestionAdminDto updated = quizService.updateQuestion(questionId, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/questions/{questionId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        try {
            quizService.deleteQuestion(questionId);
            return ResponseEntity.ok(Map.of("message", "Question deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
