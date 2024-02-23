import React from "react";
import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AppContext } from "../store/store";

function Navbar() {
  const { setMode, setCategory, setDifficulty, setError } =
    useContext(AppContext);

  function handleActive() {
    setMode(false);
    setCategory(false);
    setDifficulty(false);
    setError(false);
  }

  return (
    <>
      <div className="w-full border-b-2 bg-gradient-to-r from-indigo-800 to-indigo-500 py-3 flex justify-center">
        <NavLink
          to={"/"}
          className={`rounded-md p-2 text-white text-2xl transition ease-in-out bg-gradient-to-br hover:from-indigo-400 ${({ isActive}) =>
          isActive ? handleActive() : ""}`}
          onClick={() => {
            handleActive();
          }}
        >
          Trivia Quiz Game
        </NavLink>
      </div>
      <div className="max-w-screen-lg mx-auto mt-8 px-6 lg:px-0">
        <Outlet />
      </div>
    </>
  );
}

export default Navbar;
