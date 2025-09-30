export const attempt = {
  "attempt_id": 12345,
  "user_id": 6789,
  "quiz_id": 100,
  "submitted_at": "2025-09-17T19:55:00Z",
  "score": 2,
  "total_questions": 3,
  "time_spent": 120,
  answers: Array.from({ length: 200 }, (_, i) => ({
    question_id: i + 1,
    user_answer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)], // random A-D
    correct_answer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
    is_correct: false
  }))
};


export const allTests = {
  "tests": [
    {
      "id": 1,
      "category": "TOEIC",
      "type": "Listening",
      "title": "TOEIC Listening Part 1 - Photographs",
      "duration": 25,
      "questions": 30,
      "attempts": 950
    },
    {
      "id": 2,
      "category": "TOEIC",
      "type": "Listening",
      "title": "TOEIC Listening Part 2 - Question Response",
      "duration": 30,
      "questions": 25,
      "attempts": 1120
    },
    {
      "id": 3,
      "category": "TOEIC",
      "type": "Listening",
      "title": "TOEIC Listening Part 3 - Conversations",
      "duration": 40,
      "questions": 39,
      "attempts": 875
    },
    {
      "id": 4,
      "category": "TOEIC",
      "type": "Listening",
      "title": "TOEIC Listening Part 4 - Talks",
      "duration": 45,
      "questions": 30,
      "attempts": 1340
    },
    {
      "id": 5,
      "category": "TOEIC",
      "type": "Reading",
      "title": "TOEIC Reading Part 5 - Incomplete Sentences",
      "duration": 35,
      "questions": 40,
      "attempts": 980
    },
    {
      "id": 6,
      "category": "TOEIC",
      "type": "Reading",
      "title": "TOEIC Reading Part 6 - Text Completion",
      "duration": 30,
      "questions": 16,
      "attempts": 765
    },
    {
      "id": 7,
      "category": "TOEIC",
      "type": "Reading",
      "title": "TOEIC Reading Part 7 - Single Passages",
      "duration": 50,
      "questions": 29,
      "attempts": 1420
    },
    {
      "id": 8,
      "category": "TOEIC",
      "type": "Reading",
      "title": "TOEIC Reading Part 7 - Double Passages",
      "duration": 55,
      "questions": 25,
      "attempts": 1105
    },
    {
      "id": 9,
      "category": "IELTS",
      "type": "Listening",
      "title": "IELTS Listening Practice Test 1",
      "duration": 60,
      "questions": 40,
      "attempts": 2030
    },
    {
      "id": 10,
      "category": "IELTS",
      "type": "Reading",
      "title": "IELTS Reading Academic Test 1",
      "duration": 60,
      "questions": 40,
      "attempts": 1875
    },
    {
      "id": 11,
      "category": "IELTS",
      "type": "Reading",
      "title": "IELTS Reading Academic Test 11",
      "duration": 60,
      "questions": 40,
      "attempts": 1875
    }
  ]
};

