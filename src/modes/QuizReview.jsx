import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import QuizNavigator from "../components/QuizNavigator";

function QuizReview() {
  let correct = 0,
    incorrect = 0,
    unanswered = 0;
  
  const { state } = useLocation();

  // Extract data
  const questions      = state?.questions;
  const marksCorrect   = state?.marksCorrect ?? 1;
  const marksDeduction = state?.marksDeduction ?? 0;
  const answers        = state?.answers;

  const [index, setIndex] = useState(0);
  const q = questions[index];

  const gradient = [
    "bg-gradient-to-br",
    "bg-gradient-to-bl",
    "bg-gradient-to-tr",
    "bg-gradient-to-tl",
  ];

  

  questions.forEach((q, i) => {
    if (!answers[i]) unanswered += 1;
    else if (answers[i] === q.answer) correct += 1;
    else incorrect += 1;
  });

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowRight") {
        setIndex((prev) => Math.min(prev + 1, questions.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIndex((prev) => Math.max(prev - 1, 0));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [index, questions]);

  return (
    <div className="grid md:grid-rows-1 md:grid-cols-6 gap-4">
      {/* RIGHT: Navigator */}
      <div className="md:col-span-2 border p-4 rounded-xl md:order-last">
        <QuizNavigator
          total={questions.length}
          quiz={questions}
          answers={answers}
          current={index}
          setIndex={setIndex}
          mode="review"
        />
      </div>

      {/* LEFT: Question Review */}
      <div className="md:col-span-4 border p-6 rounded-xl">
        <h1 className="text-2xl font-bold mb-4">
          Score: {correct * marksCorrect - incorrect * marksDeduction} / {questions.length * marksCorrect} <br></br>({" "}
          <span className="text-green-600">Correct: {correct}</span>,{" "}
          <span className="text-red-600"> Incorrect: {incorrect}</span>,{" "}
          <span className="text-gray-600"> Unanswered: {unanswered}</span> )
        </h1>

        <div className="col-span-3 border p-6 rounded-xl">
          <div className="text-xl font-bold mb-4">
            <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
              <button
                onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
                disabled={index === 0}
                className="bg-green-600 hover:bg-green-500 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg md:hidden"
              >
                <img
                  width="24"
                  height="24"
                  src="https://img.icons8.com/material-rounded/24/FFFFFF/arrow-pointing-left.png"
                  alt="arrow-pointing-left"
                />
              </button>
              <div className="flex-1">Q{index + 1}</div>
              <button
                onClick={() =>
                  setIndex((prev) => Math.min(prev + 1, questions.length - 1))
                }
                disabled={index === questions.length - 1}
                className="bg-green-600 hover:bg-green-500 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg md:hidden"
              >
                <img
                  width="30"
                  height="30"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/right--v1.png"
                  alt="right--v1"
                />
              </button>
            </div>

            <span className="whitespace-pre-line">{q.question}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {q.options.map((opt, i) => (
              <button
                key={opt}
                className={`${gradient[i]}  p-4 rounded-md text-white text-lg
                ${
                  opt === q.answer
                    ? "from-green-600 via-green-600"
                    : answers[index] === opt
                      ? "from-red-600 via-red-600"
                      : "from-indigo-800 from-40% via-indigo-400 via-80%"
                }
              `}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-xl font-semibold">Explanation : </p>
          <div className="mt-3">
          <p className="whitespace-pre-line">{q.explanation}</p>
        </div>
        </div>

        
      </div>
    </div>
  );
}

export default QuizReview;
