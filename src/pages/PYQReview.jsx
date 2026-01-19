import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import PYQNavigator from "../components/PYQNavigator";

import quiz2025 from "../data/pyq/2025.json";
// import quiz2024 from "../data/pyq/2024.json";

const QUIZ_MAP = {
  2025: quiz2025,
  // 2024: quiz2024
};

function PYQReview() {
  const { year } = useParams();
  const { state } = useLocation();
  const answers = state.answers;
  const quiz = QUIZ_MAP[year].results;

  const [index, setIndex] = useState(0);
  const q = quiz[index];

  let score = 0;
  quiz.forEach((q, i) => {
    if (answers[i] === q.correct_answer) score += 4;
    else score -= 1;
  });

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* LEFT: Question Review */}
      <div className="col-span-3 border p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">
          Score: {score} / {quiz.length}
        </h1>

        <div className="font-bold text-lg">
          Q{index + 1}. {q.question}
        </div>

        <div
          className={`mt-3 font-semibold ${
            answers[index] === q.correct_answer
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          Your Answer: {answers[index] || "Not Answered"}
        </div>

        <div className="text-green-700">Correct Answer: {q.correct_answer}</div>

        <div className="mt-3 italic">Explanation: {q.explanation}</div>
      </div>

      {/* RIGHT: Navigator */}
      <div className="border p-4 rounded-xl">
        <PYQNavigator
          total={quiz.length}
          quiz={quiz}
          answers={answers}
          current={index}
          setIndex={setIndex}
          mode="review"
        />
      </div>
    </div>
  );
}

export default PYQReview;
