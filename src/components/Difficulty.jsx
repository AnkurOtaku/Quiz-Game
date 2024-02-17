import React, { useContext } from "react";
import { AppContext } from "../store/store";

function Difficulty({ questionCount }) {
  const { setDifficulty, difficulty } = useContext(AppContext);
  const level = ["Mixed", "easy", "medium", "hard"];
  const count = [
    questionCount.total_question_count,
    questionCount.total_easy_question_count,
    questionCount.total_medium_question_count,
    questionCount.total_hard_question_count,
  ];

  return (
    <>
      <div className="text-center text-lg my-2">Select Difficulty</div>
      <div className="max-w-screen-lg text-white my-4 mx-auto grid grid-cols-2 gap-4 justify-items-center px-6">
        {level.map((part, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setDifficulty(part);
              }}
              className={`w-full grid grid-cols-3 text-center py-[10%] text-xl rounded-md capitalize px-2 ${
                index === difficulty
                  ? "bg-indigo-900"
                  : `bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80%`
              }`}
            >
              <div className="col-span-2">{part}</div>
              <div className="bg-indigo-900 rounded-full h-full px-2">
                {count[index]}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default Difficulty;
