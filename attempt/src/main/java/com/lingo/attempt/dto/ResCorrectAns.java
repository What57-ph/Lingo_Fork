package com.lingo.attempt.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResCorrectAns {
  private long questionId;
  private String correctAnswer;
}
