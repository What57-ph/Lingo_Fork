package com.lingo.testservice.controller;

import com.lingo.testservice.model.Test;
import com.lingo.testservice.model.dto.request.test.ReqCreateTestDTO;
import com.lingo.testservice.model.dto.request.test.ReqUpdateTestDTO;
import com.lingo.testservice.model.dto.response.ResPaginationDTO;
import com.lingo.testservice.model.dto.response.ResTestDTO;
import com.lingo.testservice.service.TestService;
import com.turkraft.springfilter.boot.Filter;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/test")
@RequiredArgsConstructor
@Tag(name = "Test API", description = "Manage tests and filtering/pagination features")
public class TestController {

    private final TestService testService;

    @Tag(name = "create")
    @Operation(
            summary = "Create new test",
            description = "Create a test without passing questions or media resources in the request body"
    )
    @PostMapping("/add")
    @CacheEvict(value = "allTests", allEntries = true)
    public ResTestDTO add(@RequestBody ReqCreateTestDTO dto) {
        return testService.add(dto);
    }

    @Tag(name = "update")
    @Operation(
            summary = "Update test",
            description = "Update test metadata such as title, description, or category"
    )
    @PutMapping("/update/{id}")
    @CacheEvict(value = "allTests", allEntries = true)
    public ResTestDTO update(@RequestBody ReqUpdateTestDTO dto, @PathVariable("id") long id) {
        return testService.update(id, dto);
    }

    @Tag(name = "delete")
    @Operation(
            summary = "Delete test",
            description = "Delete a test by its ID. Also clears the cached test list."
    )
    @DeleteMapping("/delete/{id}")
    @CacheEvict(value = "allTests", allEntries = true)
    public void delete(@PathVariable long id) {
        testService.delete(id);
    }

    @Tag(name ="find")
    @Operation(
            summary = "Get all tests (with filter & pagination)",
            description = "Retrieve all tests using SpringFilter for dynamic searching and Pageable for pagination"
    )
    @GetMapping("/all")
    public ResponseEntity<ResPaginationDTO> getAll(
            @Filter Specification<Test> spec,
            Pageable pageable
    ) {
        return ResponseEntity.ok(testService.getAll(spec, pageable));
    }

    @Tag(name = "find")
    @Operation(
            summary = "Get test by ID",
            description = "Retrieve detailed information about a specific test including metadata"
    )
    @GetMapping("/{id}")
    public ResTestDTO getOne(@PathVariable long id) throws Exception {
        return testService.getOne(id);
    }
}
