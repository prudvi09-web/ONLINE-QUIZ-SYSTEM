package com.quiz.system.repository;

import com.quiz.system.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdOrderByCompletedAtDesc(Long userId);
    List<QuizAttempt> findAllByOrderByCompletedAtDesc();
    List<QuizAttempt> findByQuizIdOrderByCompletedAtDesc(Long quizId);
    
    @Query("SELECT qa FROM QuizAttempt qa ORDER BY qa.percentage DESC, qa.timeTakenSeconds ASC")
    List<QuizAttempt> findTopLeaderboard();

    @Query("SELECT AVG(qa.percentage) FROM QuizAttempt qa")
    Double calculateOverallAverageScore();

    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.passed = true")
    Long countPassedAttempts();
}
