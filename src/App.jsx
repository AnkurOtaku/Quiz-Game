import { useContext } from "react";
import { AppContext } from "./store/store";
import { NavLink  } from "react-router-dom";

import category_marathon from "./media/category_marathon.jpg";
import time_attack from "./media/time_attack.jpg";
import random_quiz from "./media/random_quiz.jpg";
import favourates from "./media/favourates.jpg";
import luck_test from "./media/luck_test.jpg";
import pyq_image from "./media/pyq_image.png"; //download this from net


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
  const { token, setError, setToken } = useContext(AppContext);
  const modes = [
    { name: "Category Marathon", route: "category_marathon", image: category_marathon },
    { name: "Time Attack", route: "time_attack", image: time_attack },
    { name: "Random Quiz", route: "random_quiz", image: random_quiz },
    { name: "Favourates", route: "favourates", image: favourates },
    { name: "PYQ", route: "pyq", image: pyq_image },
  ];

  function handleToken() {
    token ? setToken(false) : getToken(setToken, setError);
  }

  return (
    <>
      <div className="text-white my-4 grid grid-cols-2 gap-4">
        {modes.map((obj) => {
          return (
            <NavLink
              key={obj.route}
              to={`${obj.route}`}
              style={{ backgroundImage: `url(${obj.image})` }}
              className={`w-full min-h-[150px] text-center text-xl rounded-md transition-transform bg-cover hover:scale-105`}
            >
              <div className="h-full rounded-md py-[10%] bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.7)] text-wrap break-words">
                {obj.name}
              </div>
            </NavLink>
          );
        })}
      </div>

      <div className="text-white my-4 grid grid-cols-2 gap-4 justify-items-center">
        <NavLink
          to={`test_luck`}
          style={{ backgroundImage: `url(${luck_test})` }}
          className={`w-full min-h-[150px] text-center text-xl rounded-md transition-transform bg-cover hover:scale-105`}
        >
          <div className="h-full rounded-md py-[10%] bg-[rgba(0,0,0,0.5)] text-wrap break-words">
            Luck Test
          </div>
        </NavLink>
        <button
          onClick={() => {
            handleToken();
          }}
          className={`w-full text-center py-[10%] text-xl rounded-md px-2 transition-transform hover:scale-105 ${
            token
              ? "bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80% hover:bg-indigo-900"
              : "bg-black"
          }`}
        >
          Don't Repeat Questions : {token ? "yes" : "no"}
        </button>
      </div>
    </>
  );
}

export default App;
