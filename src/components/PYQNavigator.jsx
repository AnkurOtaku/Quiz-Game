// src/components/PYQNavigator.jsx
function PYQNavigator({
  total,
  answers = {},
  current,
  setIndex,
  mode = "exam",
  quiz = []
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: total }).map((_, i) => {
        let color = "bg-purple-600"; // unanswered

        if (mode === "exam") {
          if (answers[i]) color = "bg-green-600";
        }

        if (
          mode === "review" &&
          quiz[i] &&
          quiz[i].correct_answer
        ) {
          if (answers[i]) {
            color =
              answers[i] === quiz[i].correct_answer
                ? "bg-green-600"
                : "bg-red-600";
          }
        }

        if (i === current) {
          color = "bg-gray-400";
        }

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
  );
}

export default PYQNavigator;