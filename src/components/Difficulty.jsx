import React, { useContext } from "react";
import { AppContext } from "../store/store";

function Category() {
  const { setDifficulty, difficulty } = useContext(AppContext);
  const level = ["Mixed", "Easy", "Medium", "Hard"];
  return (
    <>
      <div className="text-center text-lg my-2">Select Difficulty</div>
      <div className="max-w-screen-lg text-white my-4 mx-auto grid grid-cols-2 gap-4 justify-items-center px-6">
        {level.map((part, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setDifficulty(index==0?4:index);
              }}
              className={`w-full text-center py-[10%] text-xl rounded-md px-2 ${
                index === difficulty
                  ? "bg-indigo-900"
                  : `bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80%`
              }`}
            >
              {part}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default Category;
