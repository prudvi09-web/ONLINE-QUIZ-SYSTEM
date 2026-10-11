package com.quiz.system.service;

import com.quiz.system.dto.*;
import com.quiz.system.entity.*;
import com.quiz.system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizAttemptService {

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public QuizResultDto submitQuiz(QuizSubmitRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUserEntity();

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + request.getQuizId()));

        List<Question> questions = questionRepository.findByQuizId(quiz.getId());
        if (questions.isEmpty()) {
            throw new RuntimeException("Quiz has no questions to evaluate");
        }

        Map<Long, String> submittedAnswers = request.getAnswers() != null ? request.getAnswers() : Map.of();

        int totalScore = 0;
        int maxScore = 0;
        int correctCount = 0;
        int incorrectCount = 0;
        int skippedCount = 0;

        List<QuizAttemptAnswer> attemptAnswers = new ArrayList<>();

        for (Question q : questions) {
            maxScore += q.getMarks();
            String chosen = submittedAnswers.get(q.getId());

            QuizAttemptAnswer answer = new QuizAttemptAnswer();
            answer.setQuestionId(q.getId());
            answer.setQuestionText(q.getQuestionText());
            answer.setOptionA(q.getOptionA());
            answer.setOptionB(q.getOptionB());
            answer.setOptionC(q.getOptionC());
            answer.setOptionD(q.getOptionD());
            answer.setCorrectOption(q.getCorrectOption());
            answer.setExplanation(q.getExplanation());

            if (chosen == null || chosen.trim().isEmpty()) {
                answer.setSelectedOption(null);
                answer.setCorrect(false);
                skippedCount++;
            } else {
                String cleanChoice = chosen.trim().toUpperCase();
                answer.setSelectedOption(cleanChoice);
                if (cleanChoice.equals(q.getCorrectOption().toUpperCase())) {
                    answer.setCorrect(true);
                    totalScore += q.getMarks();
                    correctCount++;
                } else {
                    answer.setCorrect(false);
                    incorrectCount++;
                }
            }
            attemptAnswers.add(answer);
        }

        double percentage = maxScore > 0 ? ((double) totalScore / maxScore) * 100.0 : 0.0;
        percentage = Math.round(percentage * 100.0) / 100.0;
        boolean passed = percentage >= quiz.getPassingPercentage();

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(currentUser);
        attempt.setQuiz(quiz);
        attempt.setTotalScore(totalScore);
        attempt.setMaxScore(maxScore);
        attempt.setPercentage(percentage);
        attempt.setPassed(passed);
        attempt.setTotalQuestions(questions.size());
        attempt.setCorrectCount(correctCount);
        attempt.setIncorrectCount(incorrectCount);
        attempt.setSkippedCount(skippedCount);
        attempt.setTimeTakenSeconds(request.getTimeTakenSeconds());
        attempt.setStartedAt(LocalDateTime.now().minusSeconds(request.getTimeTakenSeconds()));
        attempt.setCompletedAt(LocalDateTime.now());

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        for (QuizAttemptAnswer ans : attemptAnswers) {
            ans.setAttempt(savedAttempt);
        }
        savedAttempt.setAnswers(attemptAnswers);
        quizAttemptRepository.save(savedAttempt);

        return mapToResultDto(savedAttempt);
    }

    @Transactional(readOnly = true)
    public QuizResultDto getAttemptById(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found with id: " + attemptId));

        User currentUser = authService.getCurrentAuthenticatedUserEntity();
        boolean isAdmin = "ROLE_ADMIN".equals(currentUser.getRole());
        if (!isAdmin && !attempt.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Access denied to view this result");
        }

        return mapToResultDto(attempt);
    }

    @Transactional(readOnly = true)
    public List<QuizResultDto> getUserAttempts(Long userId) {
        return quizAttemptRepository.findByUserIdOrderByCompletedAtDesc(userId).stream()
                .map(this::mapToSummaryResultDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizResultDto> getCurrentUserAttempts() {
        User currentUser = authService.getCurrentAuthenticatedUserEntity();
        return getUserAttempts(currentUser.getId());
    }

    @Transactional(readOnly = true)
    public List<QuizResultDto> getAllAttempts() {
        return quizAttemptRepository.findAllByOrderByCompletedAtDesc().stream()
                .map(this::mapToSummaryResultDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LeaderboardDto> getLeaderboard() {
        return quizAttemptRepository.findTopLeaderboard().stream()
                .limit(20)
                .map(a -> new LeaderboardDto(
                        a.getId(),
                        a.getUser().getId(),
                        a.getUser().getName(),
                        a.getQuiz().getTitle(),
                        a.getTotalScore(),
                        a.getMaxScore(),
                        a.getPercentage(),
                        a.getTimeTakenSeconds(),
                        a.getCompletedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalQuizzes = quizRepository.count();
        long totalCategories = categoryRepository.count();
        long totalQuestions = questionRepository.count();
        long totalAttempts = quizAttemptRepository.count();

        Double avgScore = quizAttemptRepository.calculateOverallAverageScore();
        double averageScore = avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : 0.0;

        Long passedAttempts = quizAttemptRepository.countPassedAttempts();
        double passRate = (totalAttempts > 0 && passedAttempts != null)
                ? Math.round(((double) passedAttempts / totalAttempts) * 1000.0) / 10.0
                : 0.0;

        return new DashboardStatsDto(
                totalUsers,
                totalQuizzes,
                totalCategories,
                totalQuestions,
                totalAttempts,
                averageScore,
                passRate
        );
    }

    private QuizResultDto mapToResultDto(QuizAttempt attempt) {
        QuizResultDto dto = mapToSummaryResultDto(attempt);
        if (attempt.getAnswers() != null) {
            dto.setAnswers(attempt.getAnswers().stream().map(a -> new QuizAttemptAnswerDto(
                    a.getQuestionId(),
                    a.getQuestionText(),
                    a.getOptionA(),
                    a.getOptionB(),
                    a.getOptionC(),
                    a.getOptionD(),
                    a.getSelectedOption(),
                    a.getCorrectOption(),
                    a.isCorrect(),
                    a.getExplanation()
            )).collect(Collectors.toList()));
        }
        return dto;
    }

    private QuizResultDto mapToSummaryResultDto(QuizAttempt attempt) {
        QuizResultDto dto = new QuizResultDto();
        dto.setAttemptId(attempt.getId());
        dto.setQuizId(attempt.getQuiz().getId());
        dto.setQuizTitle(attempt.getQuiz().getTitle());
        dto.setCategoryName(attempt.getQuiz().getCategory() != null ? attempt.getQuiz().getCategory().getName() : "");
        dto.setUserId(attempt.getUser().getId());
        dto.setUserName(attempt.getUser().getName());
        dto.setUserEmail(attempt.getUser().getEmail());
        dto.setTotalScore(attempt.getTotalScore());
        dto.setMaxScore(attempt.getMaxScore());
        dto.setPercentage(attempt.getPercentage());
        dto.setPassed(attempt.isPassed());
        dto.setPassingPercentage(attempt.getQuiz().getPassingPercentage());
        dto.setTotalQuestions(attempt.getTotalQuestions());
        dto.setCorrectCount(attempt.getCorrectCount());
        dto.setIncorrectCount(attempt.getIncorrectCount());
        dto.setSkippedCount(attempt.getSkippedCount());
        dto.setTimeTakenSeconds(attempt.getTimeTakenSeconds());
        dto.setStartedAt(attempt.getStartedAt());
        dto.setCompletedAt(attempt.getCompletedAt());
        return dto;
    }
}
