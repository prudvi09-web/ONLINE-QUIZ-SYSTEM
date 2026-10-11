package com.quiz.system.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class QuizAdminDto {
    private Long id;
    private String title;
    private String description;
    private Long categoryId;
    private String categoryName;
    private int durationMinutes;
    private int passingPercentage;
    private String difficulty;
    private boolean active;
    private int totalQuestions;
    private int totalMarks;
    private LocalDateTime createdAt;
    private List<QuestionAdminDto> questions = new ArrayList<>();

    public QuizAdminDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public int getPassingPercentage() { return passingPercentage; }
    public void setPassingPercentage(int passingPercentage) { this.passingPercentage = passingPercentage; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public int getTotalMarks() { return totalMarks; }
    public void setTotalMarks(int totalMarks) { this.totalMarks = totalMarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<QuestionAdminDto> getQuestions() { return questions; }
    public void setQuestions(List<QuestionAdminDto> questions) { this.questions = questions; }
}
