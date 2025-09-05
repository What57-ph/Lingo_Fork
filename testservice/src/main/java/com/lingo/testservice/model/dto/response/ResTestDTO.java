package com.lingo.testservice.model.dto.response;

import com.lingo.testservice.model.MediaResource;
import com.lingo.testservice.model.Question;
import com.lingo.testservice.utils.enums.TestType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResTestDTO {
    long id;
    String title;
    int maxScore;
    int timeLimit;
    TestType type;
//    List<Long> questions;
    String mediaUrl;
}
