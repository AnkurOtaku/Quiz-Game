import React, { useContext } from "react";
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
  const {
    token,
    setError,
    error,
    setMode,
    setCategory,
    setDifficulty,
    setToken,
    mode,
  } = useContext(AppContext);
  const modes = [
    "Category Marathon",
    "Time Attack",
    "Random Quiz",
    "Favourates",
  ];
  function handleToken() {
    token ? setToken(false): getToken(setToken, setError);
  }

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

      <div className="max-w-screen-lg mx-auto">
        {!mode && (
          <>
            <div className="text-white my-4 grid grid-cols-2 gap-4 justify-items-center px-6">
              {modes.map((modess) => {
                return (
                  <button
                    key={modess}
                    onClick={() => {
                      setMode(modess);
                    }}
                    className="w-full text-center py-[10%] text-xl rounded-md px-2 transition-transform bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80% hover:bg-indigo-900 hover:scale-105"
                  >
                    {modess}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                handleToken();
              }}
              className={`w-full mx-auto mt-8 border p-2 text-white rounded-lg ${
                token ? "bg-gradient-to-r from-indigo-800 to-indigo-500" : "bg-black"
              }`}
            >
              Don't Repeat Questions : {token ? "yes" : "no"}
            </button>
          </>
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
      </div>
    </>
  );
}

export default App;
