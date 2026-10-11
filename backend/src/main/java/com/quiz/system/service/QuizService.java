package com.quiz.system.service;

import com.quiz.system.dto.*;
import com.quiz.system.entity.Category;
import com.quiz.system.entity.Question;
import com.quiz.system.entity.Quiz;
import com.quiz.system.repository.CategoryRepository;
import com.quiz.system.repository.QuestionRepository;
import com.quiz.system.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Transactional(readOnly = true)
    public List<QuizDto> getAllActiveQuizzes() {
        return quizRepository.findByActiveTrue().stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizDto> getActiveQuizzesByCategory(Long categoryId) {
        return quizRepository.findByCategoryIdAndActiveTrue(categoryId).stream()
                .map(this::mapToSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<QuizAdminDto> getAllQuizzesForAdmin() {
        return quizRepository.findAll().stream()
                .map(this::mapToAdminDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizDto getQuizForTaking(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        if (!quiz.isActive()) {
            throw new RuntimeException("Quiz is currently inactive");
        }

        QuizDto dto = mapToSummaryDto(quiz);
        List<Question> questions = questionRepository.findByQuizId(quizId);
        dto.setTotalQuestions(questions.size());
        dto.setQuestions(questions.stream().map(q -> new QuestionDto(
                q.getId(),
                q.getQuestionText(),
                q.getOptionA(),
                q.getOptionB(),
                q.getOptionC(),
                q.getOptionD(),
                q.getMarks()
        )).collect(Collectors.toList()));

        return dto;
    }

    @Transactional(readOnly = true)
    public QuizAdminDto getQuizForAdmin(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        return mapToAdminDto(quiz);
    }

    @Transactional
    public QuizAdminDto createQuiz(QuizAdminDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));

        Quiz quiz = new Quiz(
                dto.getTitle(),
                dto.getDescription(),
                category,
                dto.getDurationMinutes() > 0 ? dto.getDurationMinutes() : 15,
                dto.getPassingPercentage() > 0 ? dto.getPassingPercentage() : 60,
                dto.getDifficulty() != null ? dto.getDifficulty() : "MEDIUM"
        );
        quiz.setActive(dto.isActive());

        Quiz savedQuiz = quizRepository.save(quiz);

        if (dto.getQuestions() != null && !dto.getQuestions().isEmpty()) {
            for (QuestionAdminDto qDto : dto.getQuestions()) {
                Question question = new Question(
                        savedQuiz,
                        qDto.getQuestionText(),
                        qDto.getOptionA(),
                        qDto.getOptionB(),
                        qDto.getOptionC(),
                        qDto.getOptionD(),
                        qDto.getCorrectOption() != null ? qDto.getCorrectOption().toUpperCase() : "A",
                        qDto.getExplanation(),
                        qDto.getMarks() > 0 ? qDto.getMarks() : 1
                );
                questionRepository.save(question);
            }
        }

        return getQuizForAdmin(savedQuiz.getId());
    }

    @Transactional
    public QuizAdminDto updateQuiz(Long quizId, QuizAdminDto dto) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        if (dto.getCategoryId() != null && !dto.getCategoryId().equals(quiz.getCategory().getId())) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with id: " + dto.getCategoryId()));
            quiz.setCategory(category);
        }

        quiz.setTitle(dto.getTitle());
        quiz.setDescription(dto.getDescription());
        quiz.setDurationMinutes(dto.getDurationMinutes());
        quiz.setPassingPercentage(dto.getPassingPercentage());
        quiz.setDifficulty(dto.getDifficulty());
        quiz.setActive(dto.isActive());

        quizRepository.save(quiz);
        return getQuizForAdmin(quizId);
    }

    @Transactional
    public void deleteQuiz(Long quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new RuntimeException("Quiz not found with id: " + quizId);
        }
        quizRepository.deleteById(quizId);
    }

    @Transactional
    public QuestionAdminDto addQuestion(Long quizId, QuestionAdminDto dto) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        Question question = new Question(
                quiz,
                dto.getQuestionText(),
                dto.getOptionA(),
                dto.getOptionB(),
                dto.getOptionC(),
                dto.getOptionD(),
                dto.getCorrectOption().toUpperCase(),
                dto.getExplanation(),
                dto.getMarks() > 0 ? dto.getMarks() : 1
        );
        Question saved = questionRepository.save(question);
        return mapToQuestionAdminDto(saved);
    }

    @Transactional
    public QuestionAdminDto updateQuestion(Long questionId, QuestionAdminDto dto) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

        question.setQuestionText(dto.getQuestionText());
        question.setOptionA(dto.getOptionA());
        question.setOptionB(dto.getOptionB());
        question.setOptionC(dto.getOptionC());
        question.setOptionD(dto.getOptionD());
        question.setCorrectOption(dto.getCorrectOption().toUpperCase());
        question.setExplanation(dto.getExplanation());
        if (dto.getMarks() > 0) question.setMarks(dto.getMarks());

        Question saved = questionRepository.save(question);
        return mapToQuestionAdminDto(saved);
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new RuntimeException("Question not found with id: " + questionId);
        }
        questionRepository.deleteById(questionId);
    }

    private QuizDto mapToSummaryDto(Quiz quiz) {
        QuizDto dto = new QuizDto();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        if (quiz.getCategory() != null) {
            dto.setCategoryId(quiz.getCategory().getId());
            dto.setCategoryName(quiz.getCategory().getName());
            dto.setCategoryIcon(quiz.getCategory().getIcon());
            dto.setCategoryColor(quiz.getCategory().getColor());
        }
        dto.setDurationMinutes(quiz.getDurationMinutes());
        dto.setPassingPercentage(quiz.getPassingPercentage());
        dto.setDifficulty(quiz.getDifficulty());
        dto.setActive(quiz.isActive());
        dto.setCreatedAt(quiz.getCreatedAt());

        List<Question> questions = questionRepository.findByQuizId(quiz.getId());
        dto.setTotalQuestions(questions.size());
        dto.setTotalMarks(questions.stream().mapToInt(Question::getMarks).sum());
        return dto;
    }

    private QuizAdminDto mapToAdminDto(Quiz quiz) {
        QuizAdminDto dto = new QuizAdminDto();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        if (quiz.getCategory() != null) {
            dto.setCategoryId(quiz.getCategory().getId());
            dto.setCategoryName(quiz.getCategory().getName());
        }
        dto.setDurationMinutes(quiz.getDurationMinutes());
        dto.setPassingPercentage(quiz.getPassingPercentage());
        dto.setDifficulty(quiz.getDifficulty());
        dto.setActive(quiz.isActive());
        dto.setCreatedAt(quiz.getCreatedAt());

        List<Question> questions = questionRepository.findByQuizId(quiz.getId());
        dto.setTotalQuestions(questions.size());
        dto.setTotalMarks(questions.stream().mapToInt(Question::getMarks).sum());
        dto.setQuestions(questions.stream().map(this::mapToQuestionAdminDto).collect(Collectors.toList()));
        return dto;
    }

    private QuestionAdminDto mapToQuestionAdminDto(Question q) {
        return new QuestionAdminDto(
                q.getId(),
                q.getQuiz() != null ? q.getQuiz().getId() : null,
                q.getQuestionText(),
                q.getOptionA(),
                q.getOptionB(),
                q.getOptionC(),
                q.getOptionD(),
                q.getCorrectOption(),
                q.getExplanation(),
                q.getMarks()
        );
    }
}
