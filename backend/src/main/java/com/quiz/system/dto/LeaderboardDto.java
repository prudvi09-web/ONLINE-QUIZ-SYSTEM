package com.quiz.system.dto;

import java.time.LocalDateTime;

public class LeaderboardDto {
    private Long attemptId;
    private Long userId;
    private String userName;
    private String quizTitle;
    private int score;
    private int maxScore;
    private double percentage;
    private int timeTakenSeconds;
    private LocalDateTime completedAt;

    public LeaderboardDto() {}

    public LeaderboardDto(Long attemptId, Long userId, String userName, String quizTitle, int score, int maxScore, double percentage, int timeTakenSeconds, LocalDateTime completedAt) {
        this.attemptId = attemptId;
        this.userId = userId;
        this.userName = userName;
        this.quizTitle = quizTitle;
        this.score = score;
        this.maxScore = maxScore;
        this.percentage = percentage;
        this.timeTakenSeconds = timeTakenSeconds;
        this.completedAt = completedAt;
    }

    public Long getAttemptId() { return attemptId; }
    public void setAttemptId(Long attemptId) { this.attemptId = attemptId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getQuizTitle() { return quizTitle; }
    public void setQuizTitle(String quizTitle) { this.quizTitle = quizTitle; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getMaxScore() { return maxScore; }
    public void setMaxScore(int maxScore) { this.maxScore = maxScore; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public int getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(int timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
