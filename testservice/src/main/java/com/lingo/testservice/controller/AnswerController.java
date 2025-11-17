package com.lingo.testservice.controller;

import com.lingo.testservice.model.dto.request.answer.ReqAnswerDTO;
import com.lingo.testservice.model.dto.response.ResAnswerDTO;
import com.lingo.testservice.model.dto.response.ResCorrectAnswerDTO;
import com.lingo.testservice.service.AnswerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/answer")
@RequiredArgsConstructor
@Tag(name = "Answer API", description = "Manage answers of questions")
public class AnswerController {

    private final AnswerService answerService;

    @Tag(name = "create")
    @Operation(
            summary = "Create new answer",
            description = "Add a new answer for a question"
    )
    @PostMapping("/add")
    public ResAnswerDTO add(@RequestBody ReqAnswerDTO dto) {
        return answerService.add(dto);
    }

    @Tag(name= "update")
    @Operation(
            summary = "Update answer",
            description = "Update an existing answer by its ID"
    )
    @PutMapping("/update/{id}")
    public ResAnswerDTO update(@RequestBody ReqAnswerDTO dto, @PathVariable("id") long id) {
        return answerService.update(dto, id);
    }

    @Tag(name = "delete")
    @Operation(
            summary = "Delete answer",
            description = "Delete an answer by its ID"
    )
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable long id) {
        answerService.delete(id);
    }

    @Tag(name = "find")
    @Operation(
            summary = "Get all answers",
            description = "Retrieve a list of all answers"
    )
    @GetMapping("/all")
    public List<ResAnswerDTO> getAll() {
        return answerService.getAll();
    }

    @Tag(name ="find")
    @Operation(
            summary = "Get answer by ID",
            description = "Retrieve detail of an answer by its ID"
    )
    @GetMapping("/{id}")
    public ResAnswerDTO getOne(@PathVariable long id) throws Exception {
        return answerService.getOne(id);
    }

    @Tag(name = "find")
    @Operation(
            summary = "Get correct answers",
            description = "Given a list of question IDs, return their correct answers"
    )
    @PostMapping("/correct")
    public List<ResCorrectAnswerDTO> getMethodName(@RequestBody List<Long> questionIds) {
        return answerService.getCorrectAnswerOfQuestions(questionIds);
    }

    @Tag(name = "create")
    @Operation(
            summary = "Bulk save answers",
            description = "Save a list of answers at once"
    )
    @PostMapping("/bulk")
    public void saveAllAnswers(@RequestBody List<ReqAnswerDTO> answerDTOs) {
        answerService.saveAllAnswers(answerDTOs);
    }
}
