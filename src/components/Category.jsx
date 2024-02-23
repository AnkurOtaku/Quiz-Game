import React, { useContext } from "react";
import { AppContext } from "../store/store";
import { useNavigate } from "react-router-dom";

const getCategories = async (setCategories, setError, navigate) => {
  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    const data = await response.json();

    setCategories(data.trivia_categories);
  } catch (error) {
    console.error(error);
    setError(error);
    navigate("/error");
  }
};

function Category() {
  const { setCategory, categories, setCategories, setError } =
    useContext(AppContext);
  const navigate = useNavigate();

  if(!categories){
    getCategories(setCategories, setError, navigate);
  }

  return (
    <>
      <div className="text-center text-lg">Select Categories</div>
      <div className="text-white my-4 grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
        {categories &&
          categories.map((cat, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  setCategory(cat);
                }}
                className="w-full text-center py-[10%] text-xl rounded-md px-2 transition-transform bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80% hover:bg-indigo-900 hover:scale-105"
              >
                {cat.name}
              </button>
            );
          })}
      </div>
    </>
  );
}

export default Category;
