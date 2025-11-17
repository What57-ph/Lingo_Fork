package com.lingo.commentservice.controller;

import com.lingo.commentservice.dto.request.RequestCommentDTO;
import com.lingo.commentservice.dto.request.RequestReplyDTO;
import com.lingo.commentservice.dto.response.ResponseCommentDTO;
import com.lingo.commentservice.service.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/comment")
public class CommentController {

    CommentService commentService;
    @Tag(name = "create")
    @Tag(name = "createComment", description = "post a comment")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true)
    @PostMapping
    public ResponseEntity<ResponseCommentDTO> add(@RequestBody RequestCommentDTO dto) {
        return ResponseEntity.ok(commentService.add(dto));
    }

    @Tag(name = "update")
    @Tag(name = "updateComment", description = "update comment")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(required = true)
    @PutMapping("/{id}")
    public ResponseEntity<ResponseCommentDTO> update(@PathVariable long id,
                                                     @RequestBody RequestCommentDTO dto) {
        return ResponseEntity.ok(commentService.update(dto, id));
    }

    @Tag(name = "delete")
    @Tag(name = "deleteComment", description = "inactive a comment")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        commentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Tag(name = "find")
    @Tag(name = "findAll",description = "find all comments")
    @GetMapping
    public ResponseEntity<List<ResponseCommentDTO>> getAll() {
        return ResponseEntity.ok(commentService.getAll());
    }

    @Tag(name = "find")
    @Tag(name = "findById", description = "find specific comment")
    @GetMapping("/{id}")
    public ResponseEntity<ResponseCommentDTO> getOne(@PathVariable("id") long id) throws Exception {
        return ResponseEntity.ok(commentService.getOne(id));
    }

    @Tag(name="find")
    @Tag(name = "findReplies", description = "find all replies of a comment")
    @GetMapping("/replies/{id}")
    public ResponseEntity<List<ResponseCommentDTO>> getReplyOfComment(@PathVariable("id") long id){
        return ResponseEntity.ok(commentService.getAnswerOfComment(id));
    }

    @Tag(name = "find")
    @Tag(name = "findTestComments", description = "find all comments of specific test")
    @GetMapping("/commentOfTest/{testId}")
    public ResponseEntity<List<ResponseCommentDTO>> getAllCommentsOfTest(@PathVariable("testId") long testId){
        return ResponseEntity.ok(commentService.getCommentsOfTest(testId));
    }
}
