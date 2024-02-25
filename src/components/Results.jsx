import React from "react";
import Confetti from "canvas-confetti";
import results from "../media/results.mp3";
import score0 from '../media/score-0.mp3';

function Results({ score, quizLength }) {
  const percentage = Math.round((score / quizLength) * 100);
  function celebrate() {
    switch (true) {
      case (percentage === 100):
        Confetti({
          particleCount: 400,
          spread: 360,
        });
        new Audio(results).play();
        break;
      case (percentage >= 90 && percentage < 100):
        Confetti({
          particleCount: 300,
          spread: 270,
        });
        new Audio(results).play();
        break;
      case (percentage >= 70 && percentage < 90):
        Confetti({
          particleCount: 200,
          spread: 180,
        });
        new Audio(results).play();
        break;
      case (percentage !== 0):
        Confetti();
        new Audio(results).play();
        break;
      default: new Audio(score0).play();
        break;
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
