import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import QuizNavigator from "../components/QuizNavigator";

function Quiz() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Extract data
  const questions      = state?.questions;
  const timeLimit      = state?.timeLimit ?? 30;
  const marksCorrect   = state?.marksCorrect ?? 1;
  const marksDeduction = state?.marksDeduction ?? 0;
  const topic          = state?.topic;

  
  const [index, setIndex]       = useState(0);
  const [answers, setAnswers]   = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [isPaused, setIsPaused] = useState(false);
  const answersRef              = useRef({});

  const gradient = [
    "bg-gradient-to-br",
    "bg-gradient-to-bl",
    "bg-gradient-to-tr",
    "bg-gradient-to-tl",
  ];

  useEffect(() => {
    let mounted = true;
    const timer = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timer);
            if (mounted) submitQuiz();
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [isPaused]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!questions) return;
      if (e.key === "ArrowRight") {
        setIndex((prev) => Math.min(prev + 1, questions.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIndex((prev) => Math.max(prev - 1, 0));
      } else if (["1", "2", "3", "4"].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        if (questions[index]?.options[optIdx]) {
          selectOption(questions[index].options[optIdx]);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, questions]);


  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center text-red-600 text-xl">No quiz data found.</div>;
  }

  function selectOption(option) {
    setAnswers((prev) => {
      const updated = { ...prev, [index]: option };
      answersRef.current = updated;
      return updated;
    });
  }

  function submitQuiz() {
    navigate("/quiz/review", {
      state: {
        questions,
        answers: answersRef.current,
        marksCorrect,
        marksDeduction,
        topic,
      },
    });
  }

  const q = questions[index];

  return (
    <div className="grid md:grid-rows-1 md:grid-cols-6 gap-4">
      {/* RIGHT: Navigator */}
      <div className="md:col-span-2 border p-4 rounded-xl md:order-last">
        <div className="grid grid-cols-3 gap-2 my-2 items-center justify-items-center">
          <div className="col-span-2 font-bold text-4xl">
            {Math.floor(Math.max(0, timeLeft) / 60)}:
            {String(Math.max(0, timeLeft) % 60).padStart(2, "0")}
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`${isPaused ? "bg-red-600" : "bg-green-600"} text-white p-2 rounded-lg`}
          >
            {isPaused ? (
              <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/play--v1.png" alt="play" />
            ) : (
              <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/pause--v1.png" alt="pause" />
            )}
          </button>
        </div>

        <button onClick={submitQuiz} className="mb-2 w-full bg-red-600 text-white p-3 rounded-lg md:hidden">
          Submit
        </button>
        <QuizNavigator
          total={questions.length}
          answers={answers}
          current={index}
          setIndex={setIndex}
        />
        <button onClick={submitQuiz} className="mt-6 w-full bg-red-600 text-white p-3 rounded-lg hidden md:block">
          Submit
        </button>
      </div>

      {/* LEFT: Question */}
      <div className="md:col-span-4 border p-6 rounded-xl">
        <div className="text-xl font-bold mb-4">
          <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
            <button
              onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
              disabled={index === 0}
              className="bg-green-600 hover:bg-green-500 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg md:hidden"
            >
              <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/FFFFFF/arrow-pointing-left.png" alt="prev" />
            </button>
            <div className="flex-1">Q{index + 1}</div>
            <button
              onClick={() => setIndex((prev) => Math.min(prev + 1, questions.length - 1))}
              disabled={index === questions.length - 1}
              className="bg-green-600 hover:bg-green-500 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg md:hidden"
            >
              <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/right--v1.png" alt="next" />
            </button>
          </div>
          <span className="whitespace-pre-line">{q.question}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {q.options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => selectOption(opt)}
              className={`${gradient[i]} p-4 rounded-md text-white text-lg
                ${answers[index] === opt ? "from-green-600 via-green-600" : "from-indigo-800 from-40% via-indigo-400 via-80% hover:from-indigo-500"}
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Quiz;