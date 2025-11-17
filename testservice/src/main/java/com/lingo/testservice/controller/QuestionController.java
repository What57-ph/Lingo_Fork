package com.lingo.testservice.controller;

import com.lingo.testservice.model.dto.request.question.ReqCreateQuestionDTO;
import com.lingo.testservice.model.dto.request.question.ReqUpdateQuestionDTO;
import com.lingo.testservice.model.dto.response.ResCorrectAnswerDTO;
import com.lingo.testservice.model.dto.response.ResQuestionDTO;
import com.lingo.testservice.service.QuestionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/question")
@RequiredArgsConstructor
@Tag(name = "Question API", description = "Manage test questions")
public class QuestionController {

    private final QuestionService questionService;

    @Tag(name ="create")
    @Operation(
            summary = "Create question",
            description = "Add a new question with options and media attachments"
    )
    @PostMapping("/add")
    public ResQuestionDTO add(@RequestBody ReqCreateQuestionDTO dto) {
        return questionService.add(dto);
    }

    @Tag(name ="update")
    @Operation(
            summary = "Update question",
            description = "Update the content, answers, or media of an existing question"
    )
    @PutMapping("/update/{id}")
    public ResQuestionDTO update(@RequestBody ReqUpdateQuestionDTO dto, @PathVariable("id") long id) {
        return questionService.update(dto, id);
    }

    @Tag(name = "delete")
    @Operation(
            summary = "Delete question",
            description = "Delete a question by its ID"
    )
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable long id) {
        questionService.delete(id);
    }

    @Tag(name = "find")
    @Operation(
            summary = "Get all questions",
            description = "Retrieve all questions in the system"
    )
    @GetMapping("/all")
    public List<ResQuestionDTO> getAll() {
        return questionService.getAll();
    }

    @Tag(name = "find")
    @Operation(
            summary = "Get question by ID",
            description = "Retrieve detailed information of a question by its ID"
    )
    @GetMapping("/{id}")
    public ResQuestionDTO getOne(@PathVariable long id) throws Exception {
        return questionService.getOne(id);
    }

    @Tag(name = "create")
    @Operation(
            summary = "Bulk create questions",
            description = "Insert multiple questions at once"
    )
    @PostMapping("/bulk")
    public void saveAllQuestion(@RequestBody List<ReqCreateQuestionDTO> list) {
        questionService.saveAll(list);
    }

    @Tag(name = "find")
    @Operation(
            summary = "Get all questions for a test",
            description = "Retrieve all questions belonging to a specific test ID"
    )
    @GetMapping("/all/{testId}")
    public ResponseEntity<List<ResQuestionDTO>> getAllQuestionForTest(@PathVariable("testId") long testId)
            throws Exception {
        return ResponseEntity.ok().body(questionService.findByTestId(testId));
    }

    @Tag(name = "find")
    @Operation(
            summary = "Get all correct answers for a test",
            description = "Retrieve the correct answers for every question in a test"
    )
    @GetMapping("/correct/{testId}")
    public List<ResCorrectAnswerDTO> getCorrectAnswer(@PathVariable("testId") long testId){
        return this.questionService.getCorrectAnswerOfQuestions(testId);
    }
}
