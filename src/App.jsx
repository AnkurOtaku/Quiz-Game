import React, { useEffect, useContext } from "react";
import CategoryMarathon from "./modes/CategoryMarathon";
import TimeAttack from "./modes/TimeAttack";
import Favourates from "./modes/Favourates";
import RandomQuiz from "./modes/RandomQuiz";
import { AppContext } from "./store/store";
import Error from "./components/Error";

const getToken = async (setToken, setError) => {
  try {
    const response = await fetch(
      "https://opentdb.com/api_token.php?command=request"
    );
    const data = await response.json();

    if (data.response_code !== 0) {
      setError(data.response_code);
      return null;
    }

    setToken(data.token);
  } catch (error) {
    console.error(error);
  }
};

function App() {
  const { setError, error, setMode, setCategory, setDifficulty, setToken, mode } = useContext(AppContext);
  const modes = [
    "Category Marathon",
    "Time Attack",
    "Random Quiz",
    "Favourates",
  ];
  useEffect(() => {
    getToken(setToken, setError);
  }, []);

  return (
    <>
      <div className="w-full border-b-2 bg-gradient-to-r from-indigo-800 to-indigo-500 py-3 flex justify-center">
        <button
          className="rounded-md p-2 text-white text-2xl transition ease-in-out bg-gradient-to-br hover:from-indigo-400"
          onClick={() => {
            setMode(false);
            setCategory(false);
            setDifficulty(false);
            setError(false);
          }}
        >
          Trivia Quiz Game
        </button>
      </div>

      {!mode && (
        <div className="max-w-screen-lg text-white my-4 mx-auto grid grid-cols-2 gap-4 justify-items-center px-6">
          {modes.map((modess) => {
            return (
              <button
                key={modess}
                onClick={() => {
                  setMode(modess);
                }}
                className={`w-full text-center py-[10%] text-xl rounded-md px-2 ${
                  modess === mode
                    ? "bg-indigo-900"
                    : `bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80%`
                }`}
              >
                {modess}
              </button>
            );
          })}
        </div>
      )}

      {error ? (
        <Error />
      ) : mode === "Category Marathon" ? (
        <CategoryMarathon />
      ) : mode === "Time Attack" ? (
        <TimeAttack />
      ) : mode === "Random Quiz" ? (
        <RandomQuiz />
      ) : mode === "Favourates" ? (
        <Favourates />
      ) : (
        ""
      )}
    </>
  );
}

export default App;
