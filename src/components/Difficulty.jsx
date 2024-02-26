import React, { useContext } from "react";
import { AppContext } from "../store/store";
import mixed from '../media/mixed.jpg';
import easy from '../media/easy.jpg';
import medium from '../media/medium.jpg';
import hard from '../media/hard.jpg';

function Difficulty({ questionCount }) {
  const { setDifficulty } = useContext(AppContext);
  const levels = [
    {level:"mixed", image:mixed},
    {level:"easy", image:easy},
    {level:"medium", image:medium},
    {level:"hard", image:hard},
  ];
  const count = [
    questionCount.total_question_count,
    questionCount.total_easy_question_count,
    questionCount.total_medium_question_count,
    questionCount.total_hard_question_count,
  ];

  return (
    <>
      <div className="text-center text-lg">Select Difficulty</div>
      <div className="text-white my-4 grid grid-cols-2 gap-4 justify-items-center">
        {levels.map((part, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setDifficulty(part.level);
              }}
              style={{ backgroundImage: `url(${part.image})` }}
              className={`w-full min-h-[150px] text-center text-xl rounded-md capitalize transition-transform bg-cover hover:scale-105`}
            >
              <div className="h-full grid grid-cols-3 content-center px-2 rounded-md py-[10%] bg-[rgba(0,0,0,0.6)] text-wrap break-words">
                {questionCount && (
                  <>
                    <div className="col-span-2">{part.level}</div>
                    <div className="bg-[rgba(0,0,0,0.7)] rounded-full h-full px-2">
                      {count[index] > 50 ? 50 : count[index]}
                    </div>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

export default Difficulty;
