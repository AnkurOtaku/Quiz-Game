// src/pages/PYQExam.jsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import PYQNavigator from "../components/PYQNavigator";

import quiz2025 from "../data/pyq/2025.json";
// import quiz2024 from "../data/pyq/2024.json";

const QUIZ_MAP = {
  2025: quiz2025,
  // 2024: quiz2024
};

function PYQExam() {
  const { year } = useParams();
  const navigate = useNavigate();
  const quiz = QUIZ_MAP[year].results;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(54);

  const answersRef = useRef({});

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function selectOption(option) {
    setAnswers((prev) => {
      const updated = { ...prev, [index]: option };
      answersRef.current = updated;
      return updated;
    });
  }

  function submitQuiz() {
    navigate(`/pyq/${year}/review`, {
      state: { answers: answersRef.current },
    });
  }

  const q = quiz[index];
  const options = [...q.incorrect_answers, q.correct_answer];

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* LEFT: Question */}
      <div className="col-span-3 border p-6 rounded-xl">
        <div className="text-xl font-bold mb-4">
          Q{index + 1}. {q.question}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => selectOption(opt)}
              className={`p-4 rounded-md text-white text-lg
                ${
                  answers[index] === opt
                    ? "bg-green-600"
                    : "bg-indigo-700 hover:bg-indigo-500"
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Navigator */}
      <div className="border p-4 rounded-xl">
        <PYQNavigator
          total={quiz.length}
          answers={answers}
          current={index}
          setIndex={setIndex}
        />

        <button
          onClick={submitQuiz}
          className="mt-6 w-full bg-red-600 text-white p-3 rounded-lg"
        >
          Submit
        </button>

        <div className="mt-4 text-center font-bold">
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
        </div>
      </div>
    </div>
  );
}

export default PYQExam;
