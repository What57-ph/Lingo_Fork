package com.lingo.testservice.repository;

import com.lingo.testservice.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAllByTestId(long id);
}
