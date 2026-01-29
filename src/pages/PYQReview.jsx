import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PYQNavigator from "../components/PYQNavigator";

import quiz2022 from "../data/pyq/2022.json";
import quiz2023 from "../data/pyq/2023.json";
import quiz2024 from "../data/pyq/2024.json";
import quiz2025 from "../data/pyq/2025.json";

const QUIZ_MAP = {
  2022: quiz2022,
  2023: quiz2023,
  2024: quiz2024,
  2025: quiz2025,
};

function PYQReview() {
  const { year } = useParams();
  const { state } = useLocation();
  const answers = state.answers;
  const quiz = QUIZ_MAP[year].results;

  const [index, setIndex] = useState(0);
  const q = quiz[index];

  let correct = 0,
    incorrect = 0;
  quiz.forEach((q, i) => {
    if (answers[i] === q.answer) correct += 1;
    else incorrect += 1;
  });

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowRight") {
        setIndex((prev) => Math.min(prev + 1, quiz.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIndex((prev) => Math.max(prev - 1, 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [index, quiz]);

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* LEFT: Question Review */}
      <div className="col-span-3 border p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">
          Score: {correct * 4 - incorrect} / {quiz.length * 4} (
          <span className="text-green-600">Correct: {correct}</span>,{" "}
          <span className="text-red-600"> Incorrect: {incorrect}</span>)
        </h1>

        <div className="col-span-3 border p-6 rounded-xl">
          <div className="text-xl font-bold mb-4">
            Q{index + 1}.{" "}
            {q.question.includes(".png") ? (
              <img
                src={require(`../data/${year}/${q.question}`)}
                alt={`Question ${index + 1}`}
                className="mx-auto max-h-[300px] object-contain"
              />
            ) : (
              <span>{q.question}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {q.options.map((opt) => (
              <button
                key={opt}
                className={`p-4 rounded-md text-white text-lg
                ${
                  opt === q.answer
                    ? "bg-green-600"
                    : answers[index] === opt && opt !== q.answer
                      ? "bg-red-600"
                      : "bg-indigo-700"
                }
              `}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-3 font-semibold text-red-600 text-center"
        >
          {!answers[index] && "Unanswered"}
        </div>
        <div
          className="mt-3 text-xl font-semibold"
        >
          Explanation :
        </div>

        <div className="mt-3">
          {Array.isArray(q.explanation) ? (
            q.explanation.map((exp, i) => (
              <img
                key={i}
                src={require(`../data/${year}/${exp}`)}
                alt={`Explanation ${i + 1}`}
                className="mx-auto object-contain"
              />
            ))
          ) : (
            <p>{q.explanation}</p>
          )}
        </div>
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
