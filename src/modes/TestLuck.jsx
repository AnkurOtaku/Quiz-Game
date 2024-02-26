import React, { useEffect } from "react";
import Quiz from "../components/Quiz";

function TestLuck() {
  const quiz = [];
  for (let i = 0; i < 10; i++) {
    const correct_answer = Math.floor(Math.random() * 4) + 1;
    const incorrect_answers = [1, 2, 3, 4].filter(
      (number) => number !== correct_answer
    );

    quiz.push({
      type: "multiple",
      question: "Select any option at random",
      correct_answer: correct_answer,
      incorrect_answers: incorrect_answers,
    });
  }

  return quiz.length === 10 && <Quiz quiz={quiz} />;
}

export default TestLuck;
