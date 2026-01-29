import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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

function PYQExam() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const answersRef = useRef({});
  const quiz = QUIZ_MAP[year]?.results;
  const [timeLeft, setTimeLeft] = useState(1.2*60*quiz.length);

  useEffect(() => {
    let mounted = true;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          if (mounted) submitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "ArrowRight") {
        setIndex((prev) => Math.min(prev + 1, quiz.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIndex((prev) => Math.max(prev - 1, 0));
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (quiz[index] && quiz[index].options[optIdx]) {
          selectOption(quiz[index].options[optIdx]);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [index, quiz]);

  if (!quiz) {
    return (
      <div className="p-8 text-center text-red-600 text-xl">
        Invalid or missing year in URL. Please select a valid exam year.
      </div>
    );
  }

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

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* LEFT: Question */}
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
        <div className="mt-4 text-center font-bold">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
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
      </div>
    </div>
  );
}

export default PYQExam;
