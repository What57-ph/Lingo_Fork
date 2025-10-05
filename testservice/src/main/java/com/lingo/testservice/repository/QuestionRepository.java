package com.lingo.testservice.repository;

import com.lingo.testservice.model.Question;
import com.lingo.testservice.model.dto.response.ResCorrectAnswerDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAllByTestId(long id);
    @Query("SELECT new com.lingo.testservice.model.dto.response.ResCorrectAnswerDTO(q.id, q.answerKey) " +
            "FROM Question q WHERE q.test.id = :testId")
    List<ResCorrectAnswerDTO> findIdAndAnswerKeyByTestId(Long testId);
}
