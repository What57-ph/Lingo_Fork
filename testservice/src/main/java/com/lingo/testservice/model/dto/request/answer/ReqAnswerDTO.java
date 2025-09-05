package com.lingo.testservice.model.dto.request.answer;

import com.lingo.testservice.model.Question;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReqAnswerDTO {
    String content;
    String correct;
}
