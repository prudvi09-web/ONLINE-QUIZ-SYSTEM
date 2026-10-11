package com.quiz.system.dto;

import java.util.HashMap;
import java.util.Map;

public class QuizSubmitRequest {
    private Long quizId;
    private int timeTakenSeconds;
    // Map of questionId -> selectedOption ("A", "B", "C", "D")
    private Map<Long, String> answers = new HashMap<>();

    public QuizSubmitRequest() {}

    public QuizSubmitRequest(Long quizId, int timeTakenSeconds, Map<Long, String> answers) {
        this.quizId = quizId;
        this.timeTakenSeconds = timeTakenSeconds;
        this.answers = answers != null ? answers : new HashMap<>();
    }

    public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }

    public int getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(int timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }

    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}
