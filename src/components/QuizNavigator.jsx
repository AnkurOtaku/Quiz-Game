import React from 'react';
import PropTypes from 'prop-types';

function QuizNavigator({
  total,
  answers = {},
  current,
  setIndex,
  mode = "exam",
  quiz = []
}) {
  const itemsPerRow = 5;
  const maxRows = 2;
  const maxItems = itemsPerRow * maxRows;
  const shouldScroll = total > maxItems && mode === 'exam';

  return (
    <div className={`${shouldScroll ? 'h-32 md:h-96 overflow-y-auto overflow-x-hidden' : ''} w-full`}>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))` }}>
        {Array.from({ length: total }).map((_, i) => {
            const isAnswered = answers[i];
            const isCorrect = isAnswered && quiz[i]?.answer === answers[i];
            
            let color = "bg-gray-600"; //unanswered
            if (i === current) color = "bg-indigo-600";
            else if (mode === "exam" && isAnswered) color = "bg-green-600";
            else if (mode === "review" && isAnswered) color = isCorrect ? "bg-green-600" : "bg-red-600";

          return (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-10 h-10 rounded-full text-white ${color}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

QuizNavigator.propTypes = {
  total: PropTypes.number.isRequired,
  answers: PropTypes.object,
  current: PropTypes.number.isRequired,
  setIndex: PropTypes.func.isRequired,
  mode: PropTypes.string,
  quiz: PropTypes.array
};

export default React.memo(QuizNavigator);