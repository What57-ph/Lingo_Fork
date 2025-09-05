package com.lingo.testservice.mapper;

import com.lingo.testservice.model.Answer;
import com.lingo.testservice.model.dto.request.answer.ReqAnswerDTO;
import com.lingo.testservice.model.dto.response.ResAnswerDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AnswerMapper {
    Answer toAnswer(ReqAnswerDTO request);
    ResAnswerDTO toResAnswerDTO(Answer answer);
}
