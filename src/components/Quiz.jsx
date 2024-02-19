import React, { useEffect, useState, useContext } from "react";
import Results from "./Results";
import { AppContext } from "../store/store";

function Quiz({ quiz }) {
  const [index, setIndex] = useState(0);
  const [choose, setChoose] = useState(false);
  const [options, setOptions] = useState(0);
  const [completed, setCompleted] = useState(false);
  const { favourates, setFavourates } = useContext(AppContext);
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
      setScore(score + 1);
    }
  }

  function handleFavourate() {
    let fav = [];
    if (favourates.includes(quiz[index])) {
      favourates.map((item) => {
        return item === quiz[index] ? "" : fav.push(item);
      });
      setFavourates(fav);
    } else setFavourates([...favourates, quiz[index]]);
  }

  if (completed) {
    return <Results score={score} quizLength={quiz.length} />;
  }

  return (
    <>
      <div className="px-4 border rounded-xl mt-4">
        <div className="w-full flex justify-between items-center -translate-y-4 bg-white font-bold">
          <div className="border rounded-full px-4">
            {index + 1}/{quiz.length}
          </div>
          <button
            className="border rounded-full p-2"
            onClick={() => {
              handleFavourate();
            }}
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 -1 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
              stroke="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <title>heart-like</title> <desc>Created with Sketch Beta.</desc>
                <defs> </defs>
                <g
                  id="Page-1"
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g
                    id="Icon-Set-Filled"
                    transform="translate(-102.000000, -882.000000)"
                    fill={`${
                      favourates.includes(quiz[index]) ? "#f10404" : "#000000"
                    }`}
                  >
                    <path
                      d="M126,882 C122.667,882 119.982,883.842 117.969,886.235 C116.013,883.76 113.333,882 110,882 C105.306,882 102,886.036 102,890.438 C102,892.799 102.967,894.499 104.026,896.097 L116.459,911.003 C117.854,912.312 118.118,912.312 119.513,911.003 L131.974,896.097 C133.22,894.499 134,892.799 134,890.438 C134,886.036 130.694,882 126,882"
                      id="heart-like"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
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
                    }, 2000);
                  }}
                  disabled={choose}
                  className={`w-full text-center py-[10%] rounded-md px-2 text-xl transition-transform hover:scale-105 ${
                    choose && "cursor-not-allowed"
                  } ${
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
