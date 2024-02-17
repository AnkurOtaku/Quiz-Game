// eslint-disable-next-line
import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [error, setError] = useState(false);
  const [token, setToken] = useState(0);
  const [mode, setMode] = useState(false);
  const [category, setCategory] = useState(false);
  const [difficulty, setDifficulty] = useState(false);
  const [categories, setCategories] = useState(false);
  const [favourates, setFavourates] = useState([]);

  return (
    <AppContext.Provider
      value={{
        error: error,
        setError: setError,
        token: token,
        setToken: setToken,
        mode: mode,
        setMode: setMode,
        category: category,
        setCategory: setCategory,
        difficulty: difficulty,
        setDifficulty: setDifficulty,
        categories: categories,
        setCategories: setCategories,
        favourates: favourates,
        setFavourates: setFavourates,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
