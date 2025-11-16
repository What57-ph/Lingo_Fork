package com.lingo.attempt.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.ValueGenerationType;

@Table(name = "user_answers")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserAnswers {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private Long questionId;

  @Column(columnDefinition = "MEDIUMTEXT")
  private String userAnswer;
  private String correctAnswer;
  private boolean correct;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "attemptId")
  private Attempt attempt;
}
