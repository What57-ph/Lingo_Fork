package com.lingo.testservice.mapper;

import com.lingo.testservice.model.Question;

import com.lingo.testservice.model.dto.request.question.ReqQuestionDTO;
import com.lingo.testservice.model.dto.response.ResQuestionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    Question toQuestion(ReqQuestionDTO request);
    @Mapping(target = "mediaUrl", source = "resource.mediaUrl")
    @Mapping(target = "testId", source = "test.id")
    ResQuestionDTO toQuestionResponse(Question question);
}
