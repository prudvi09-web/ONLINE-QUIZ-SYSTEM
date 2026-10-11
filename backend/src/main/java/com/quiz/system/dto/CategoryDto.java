package com.quiz.system.dto;

public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private String color;
    private int quizCount;

    public CategoryDto() {}

    public CategoryDto(Long id, String name, String description, String icon, String color, int quizCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.color = color;
        this.quizCount = quizCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public int getQuizCount() { return quizCount; }
    public void setQuizCount(int quizCount) { this.quizCount = quizCount; }
}
