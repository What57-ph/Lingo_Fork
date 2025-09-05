package com.lingo.testservice.model.dto.response;

import com.lingo.testservice.model.Question;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResAnswerDTO {
    // if return result for when call api of question, it does not need to
    // return questionId but if call api of answer, difficult to make decision of
    // whether return questionId or not
    long id;
    String content;
    String correct;
}
