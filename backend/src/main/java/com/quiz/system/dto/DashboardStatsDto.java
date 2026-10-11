package com.quiz.system.dto;

public class DashboardStatsDto {
    private long totalUsers;
    private long totalQuizzes;
    private long totalCategories;
    private long totalQuestions;
    private long totalAttempts;
    private double averageScore;
    private double passRate;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalUsers, long totalQuizzes, long totalCategories, long totalQuestions, long totalAttempts, double averageScore, double passRate) {
        this.totalUsers = totalUsers;
        this.totalQuizzes = totalQuizzes;
        this.totalCategories = totalCategories;
        this.totalQuestions = totalQuestions;
        this.totalAttempts = totalAttempts;
        this.averageScore = averageScore;
        this.passRate = passRate;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalQuizzes() { return totalQuizzes; }
    public void setTotalQuizzes(long totalQuizzes) { this.totalQuizzes = totalQuizzes; }

    public long getTotalCategories() { return totalCategories; }
    public void setTotalCategories(long totalCategories) { this.totalCategories = totalCategories; }

    public long getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(long totalQuestions) { this.totalQuestions = totalQuestions; }

    public long getTotalAttempts() { return totalAttempts; }
    public void setTotalAttempts(long totalAttempts) { this.totalAttempts = totalAttempts; }

    public double getAverageScore() { return averageScore; }
    public void setAverageScore(double averageScore) { this.averageScore = averageScore; }

    public double getPassRate() { return passRate; }
    public void setPassRate(double passRate) { this.passRate = passRate; }
}
