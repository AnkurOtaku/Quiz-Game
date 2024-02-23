import React, { useContext, useState } from "react";
import Quiz from "../components/Quiz";
import { AppContext } from "../store/store";
import { useNavigate } from "react-router-dom";

const getQuiz = async (count, category, setError, setQuiz, token, navigate) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${count}&category=${category}${
        token ? `&token=${token}` : ""
      }`
    );
    const data = await response.json();

    if (data.response_code !== 0) {
      setError(data.response_code);
      navigate("/error");
      return null;
    }
    setQuiz((prevQuiz) => [...prevQuiz, ...data.results]);
  } catch (error) {
    console.error(error);
  }
};

const getCategories = async (setCategories, setError, navigate) => {
  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();

    setCategories(data.trivia_categories);
  } catch (error) {
    console.error(error);
    setError(error);
    navigate("/error");
  }
};

function RandomQuiz() {
  const { categories, setCategories, setError, token } = useContext(AppContext);
  const [quiz, setQuiz] = useState([]);
  const [range, setRange] = useState(15);
  const [startQuiz, setStartQuiz] = useState(false);
  const navigate = useNavigate();
  console.log(startQuiz);

  if (!categories) {
    getCategories(setCategories, setError, navigate);
  }

  function handleStartQuiz() {
    const iterations = range / 5;
    let currentIteration = 0;

    const fetchQuizWithDelay = () => {
      if (currentIteration < iterations) {
        const categoryID =
          categories[Math.floor(Math.random() * categories.length)].id;
        console.log(categoryID, categories);

        getQuiz(5, categoryID, setError, setQuiz, token, navigate)
          .then(() => {
            currentIteration++;
            setStartQuiz(true);
            setTimeout(fetchQuizWithDelay, 5000);
          })
          .catch((error) => {
            console.error(error);
            setStartQuiz(false);
          });
      }
    };

    fetchQuizWithDelay(); // Start the iteration
  }

  const handleChange = (event) => {
    setRange(parseInt(event.target.value));
  };

  if (startQuiz) {
    if (quiz.length > 0) return <Quiz quiz={quiz} questionCount={range} />;
  }

  return (
    <>
      <div className="grid grid-cols-4 justify-items-center items-center">
        <label htmlFor="rangeInput" className="font-3xl">
          Select the number of questions :
        </label>
        <input
          id="rangeInput"
          type="range"
          min="5"
          max="50"
          step="5"
          value={range}
          onChange={handleChange}
          className="col-span-2 w-[80%] px-2 bg-indigo-600"
        />
        <p className="w-fit bg-black text-white rounded-md p-2">{range}</p>
      </div>
      <div className="mt-4 w-full grid justify-items-center">
        <button
          onClick={handleStartQuiz}
          disabled={startQuiz}
          className="px-3 py-2 text-white rounded-md bg-indigo-800 hover:bg-indigo-400"
        >
          {startQuiz ? "Quiz in progress..." : "Start Quiz"}
        </button>
      </div>
    </>
  );
}

export default RandomQuiz;
