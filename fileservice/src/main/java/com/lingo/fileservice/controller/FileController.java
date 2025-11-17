package com.lingo.fileservice.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.lingo.fileservice.domain.FileDeleteDTO;
import com.lingo.fileservice.domain.FileResponse;
import com.lingo.fileservice.domain.FileUpdateDTO;
import com.lingo.fileservice.domain.ReqUpdateQuestionDTO;
import com.lingo.fileservice.domain.ReqUpdateResourceDTO;
import com.lingo.fileservice.enums.FileCategory;
import com.lingo.fileservice.service.FileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/file")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "File API", description = "Manage upload, update, and deletion of media files")
public class FileController {

    final FileService fileService;

    @Operation(
            summary = "Upload a file",
            description = "Upload a single file (audio/image/video/pdf) and attach it to a test."
    )
    @PostMapping("/upload")
    public ResponseEntity<FileResponse> uploadFile(
            @RequestParam(name = "file", required = false) MultipartFile file,
            @RequestParam("testTitle") String testTitle,
            @RequestParam("fileCategory") FileCategory fileCategory) throws IOException {

        FileResponse response = fileService.uploadSingleFile(file, testTitle, fileCategory);
        return ResponseEntity.ok().body(response);
    }

    @Operation(
            summary = "Upload multiple files",
            description = "Upload multiple files and attach them to a test."
    )
    @PostMapping("/uploadMany")
    public ResponseEntity<List<FileResponse>> uploadMultipleFiles(
            @RequestParam(name = "files", required = false) MultipartFile[] files,
            @RequestParam("testTitle") String testTitle,
            @RequestParam("fileCategory") FileCategory fileCategory) throws IOException {

        List<FileResponse> response = fileService.uploadMultipleFiles(files, testTitle, fileCategory);
        return ResponseEntity.ok().body(response);
    }

    @Operation(
            summary = "Delete file",
            description = "Delete a single file from storage using its metadata."
    )
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteSingleFIle(@RequestBody FileDeleteDTO updatedFileName) throws IOException {
        fileService.deleteFile(updatedFileName);
        return ResponseEntity.ok().body(null);
    }

    @Operation(
            summary = "Update media resource file",
            description = "Replace the file content of an existing media resource (audio/image/video) associated with a resource ID."
    )
    @PutMapping("/updateContent/{resourceId}")
    public ResponseEntity<FileResponse> updateFileAndMediaResource(
            @RequestParam("file") @NotNull MultipartFile file,
            @RequestParam("testTitle") @NotBlank String testTitle,
            @RequestParam("fileCategory") @NotNull FileCategory fileCategory,
            @RequestParam("currentResourceContent") @NotBlank String currentResourceContent,
            @RequestParam("updatedFileName") @NotBlank String updatedFileName,
            @PathVariable("resourceId") long resourceId) throws IOException, Exception {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        ReqUpdateResourceDTO resourceDTO = new ReqUpdateResourceDTO();

        FileResponse response = fileService.updateMediaResource(
                resourceDTO, updatedFileName, file, testTitle, fileCategory, resourceId);

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Update explanation file for a question",
            description = "Replace the explanation file (PDF/audio/image) belonging to a question."
    )
    @PutMapping("/updateExplanation/{questionId}")
    public ResponseEntity<FileResponse> updateExplanationResourceContent(
            @RequestParam("file") @NotNull MultipartFile file,
            @RequestParam("testTitle") @NotBlank String testTitle,
            @RequestParam("fileCategory") @NotNull FileCategory fileCategory,
            @RequestParam("currentResourceContent") @NotBlank String currentResourceContent,
            @RequestParam("updatedFileName") @NotBlank String updatedFileName,
            @PathVariable("questionId") long questionId) throws IOException, Exception {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        ReqUpdateQuestionDTO questionDTO = new ReqUpdateQuestionDTO();

        FileResponse response = fileService.updateMediaResource(
                updatedFileName, file, testTitle, fileCategory, questionDTO, questionId);

        return ResponseEntity.ok(response);
    }
}
