package com.lingo.testservice.controller;

import com.lingo.testservice.model.dto.request.resource.ReqMediaResourceDTO;
import com.lingo.testservice.model.dto.response.ResMediaResourceDTO;
import com.lingo.testservice.service.MediaResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resource")
@RequiredArgsConstructor
@Tag(name = "Media Resource API", description = "Manage audio/video/image media resources")
public class MediaResourceController {

    private final MediaResourceService mediaResourceService;

    @Tag(name ="create")
    @Operation(
            summary = "Create media resource",
            description = "Add a new media resource such as audio, image, or video"
    )
    @PostMapping("/add")
    public ResMediaResourceDTO add(@RequestBody ReqMediaResourceDTO dto) {
        return mediaResourceService.add(dto);
    }

    @Tag(name = "update")
    @Operation(
            summary = "Update media resource",
            description = "Update an existing media resource by its ID"
    )
    @PutMapping("/update/{id}")
    public ResMediaResourceDTO update(@RequestBody ReqMediaResourceDTO dto,
                                      @PathVariable("id") long id) {
        return mediaResourceService.update(dto, id);
    }

    @Tag(name = "delete")
    @Operation(
            summary = "Delete media resource",
            description = "Delete a media resource by its ID"
    )
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable long id) {
        mediaResourceService.delete(id);
    }

    @Tag(name ="find")
    @Operation(
            summary = "Get all media resources",
            description = "Retrieve a list of all uploaded media resources"
    )
    @GetMapping("/all")
    public List<ResMediaResourceDTO> getAll() {
        return mediaResourceService.getAll();
    }

    @Tag(name ="find")
    @Operation(
            summary = "Get media resource detail",
            description = "Retrieve detail of a specific media resource by its ID"
    )
    @GetMapping("/one/{id}")
    public ResMediaResourceDTO getOne(@PathVariable long id) throws Exception {
        return mediaResourceService.getOne(id);
    }
}
