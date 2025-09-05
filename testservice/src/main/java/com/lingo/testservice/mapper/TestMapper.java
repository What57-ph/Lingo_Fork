package com.lingo.testservice.mapper;

import com.lingo.testservice.model.Test;
import com.lingo.testservice.model.dto.request.test.ReqTestDTO;
import com.lingo.testservice.model.dto.response.ResTestDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TestMapper {
    Test toTest(ReqTestDTO request);
    @Mapping(target = "mediaUrl", source = "resource.mediaUrl")
    ResTestDTO toTestResponse(Test test);
}
