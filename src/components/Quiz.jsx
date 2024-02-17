import React, { useEffect, useState, useContext } from "react";
import Results from "./Results";
import { AppContext } from "../store/store";

function Quiz({ quiz }) {
  const [index, setIndex] = useState(0);
  const [choose, setChoose] = useState(false);
  const [options, setOptions] = useState(0);
  const [completed, setCompleted] = useState(false);
  const {favourates, setFavourates} = useContext(AppContext);
  const [score, setScore] = useState(0);

  const nextQuestion = () => {
    if (index + 1 < quiz.length) {
      setIndex(index + 1);
      setChoose(false);
    } else {
      setCompleted(true);
    }
  };

  function decodeHTMLEntities(str) {
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(
      `<!doctype html><body>${str}`,
      "text/html"
    ).body.textContent;
    return decodedString;
  }

  useEffect(() => {
    if (quiz[index].type === "multiple") {
      const random = Math.floor(Math.random() * 4) + 0;
      const shuffled_options = [...quiz[index].incorrect_answers];
      shuffled_options.splice(random, 0, quiz[index].correct_answer);
      setOptions(shuffled_options);
    } else {
      setOptions(["True", "False"]);
    }
  }, [index]);

  function updateScore(option) {
    if (option === quiz[index].correct_answer) {
      setScore(score+1);
    }
  }

  if (completed) {
    return <Results score={score} quizLength={quiz.length} />;
  }

  return (
    <>
      <div className="mx-auto max-w-screen-lg px-4 border rounded-xl mt-4">
        <div className="w-full flex justify-between -translate-y-4 bg-white p-2 font-bold">
          <div className="border rounded-full px-4">
            {index + 1}/{quiz.length}
          </div>
          <button
            className={`border rounded-full px-4 ${favourates.includes(quiz[index])?'bg-indigo-500 cursor-not-allowed':''}`}
            disabled={favourates.includes(quiz[index])}
            onClick={() => {
              setFavourates([...favourates, quiz[index]]);
            }}
          >
            Add to Favourates
          </button>
        </div>
        <div className="font-bold text-pretty text-center text-xl">
          {decodeHTMLEntities(quiz[index].question)}
        </div>
        <div className="text-white my-4 mx-auto grid grid-cols-2 gap-4 justify-items-center px-6">
          {options &&
            options.map((option, i) => {
              return (
                <button
                  key={i}
                  onClick={() => {
                    setChoose(option);
                    updateScore(option);
                    setTimeout(() => {
                      nextQuestion();
                    }, 2500);
                  }}
                  disabled={choose}
                  className={`w-full text-center py-[10%] text-xl ${
                    choose && "cursor-not-allowed"
                  } rounded-md px-2 ${
                    !choose ||
                    (option !== quiz[index].correct_answer && choose !== option)
                      ? `bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80%`
                      : choose === quiz[index].correct_answer ||
                        option === quiz[index].correct_answer
                      ? "bg-lime-600"
                      : "bg-red-700"
                  }`}
                >
                  {decodeHTMLEntities(option)}
                </button>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Quiz;
