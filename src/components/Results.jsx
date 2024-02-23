import React from "react";
import Confetti from "canvas-confetti";

function Results({ score, quizLength }) {
  const percentage = Math.round((score / quizLength) * 100);
  function celebrate() {
    if(percentage===100){
      Confetti({
        particleCount: 400,
        spread: 360,
      });
    }
    else if (percentage >= 90 && percentage<100) {
      Confetti({
        particleCount: 300,
        spread: 270,
      });
    }
    else if (percentage >= 70 && percentage<90) {
      Confetti({
        particleCount: 200,
        spread: 180,
      });
    } else if (percentage!==0) {
      Confetti();
    }
  }
  celebrate();

  return (
    <>
      <div className="px-4 text-center font-bold h-[75vh] gap-4 grid justify-items-center content-center skew-y-[170deg] overflow-hidden">
        <div className="text-3xl">Congratulations, You completed a quiz.</div>
        <div className="text-3xl md:text-6xl">Score : {percentage}%</div>
        <button
          onClick={() => {
            celebrate();
          }}
          className="bg-gradient-to-br from-orange-600 to-blue-500 px-3 text-xl border-0 py-1 rounded-xl"
        >
          Celebrate Again
        </button>
      </div>
    </>
  );
}

export default Results;
