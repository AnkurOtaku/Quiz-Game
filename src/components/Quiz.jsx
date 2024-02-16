import React, { useEffect, useState } from "react";

function Quiz({ quiz }) {
  const [index, setIndex] = useState(0);
  const [choose, setChoose] = useState(false);
  const [options, setOptions] = useState(0);

  const nextQuestion = () => {
    if (index < quiz.length) {
      setIndex(index + 1);
      setChoose(false);
    }
  };

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

  return (
    <>
      <div className="mx-auto max-w-screen-lg px-4 border rounded-xl mt-2">
        <div className="font-bold text-pretty text-center text-xl">
          {quiz[index].question}
        </div>
        <div className="text-white my-4 mx-auto grid grid-cols-2 gap-4 justify-items-center px-6">
          {options && options.map((option, i) => {
            return (
              <button
                key={i}
                onClick={() => {
                  setChoose(option);
                  setTimeout(() => {
                    nextQuestion();
                  }, 2500);
                }}
                disabled={choose ? true: false}
                className={`w-full text-center py-[10%] text-xl ${choose && 'cursor-not-allowed'} rounded-md px-2 ${
                  !choose || (option !== quiz[index].correct_answer && choose !== option)
                    ? `bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80%`
                    : choose === quiz[index].correct_answer || option === quiz[index].correct_answer
                    ? "bg-lime-600"
                    : "bg-red-700"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Quiz;
