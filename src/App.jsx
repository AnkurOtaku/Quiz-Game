import React, { useContext } from "react";
import { AppContext } from "./store/store";
import { NavLink } from "react-router-dom";

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
  const { token, setError, setMode, setToken, mode } = useContext(AppContext);
  const modes = [
    { name: "Category Marathon", route: "category_marathon" },
    { name: "Time Attack", route: "time_attack" },
    { name: "Random Quiz", route: "random_quiz" },
    { name: "Favourates", route: "favourates" },
  ];
  function handleToken() {
    token ? setToken(false) : getToken(setToken, setError);
  }

  return (
    <>
      <div className="text-white my-4 grid grid-cols-2 gap-4 justify-items-center">
        {modes.map((obj) => {
          return (
            <NavLink
              key={obj.route}
              to={`${obj.route}`}
              className={`w-full text-center py-[10%] text-xl rounded-md px-2 transition-transform bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80% hover:bg-indigo-900 hover:scale-105 ${({
                isActive,
              }) => (isActive ? setMode(obj.name) : "")}}`}
            >
              {obj.name}
            </NavLink>
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
  );
}

export default App;
