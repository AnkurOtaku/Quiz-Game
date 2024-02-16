import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../store/store";

const getCategories = async(setCategories, setError)=>{
  try {
    const response = await fetch('https://opentdb.com/api_category.php');
    const data = await response.json();

    setCategories(data.trivia_categories);

  } catch (error) {
    console.error(error);
    setError(error);
  }
};

function Category() {
  const { category, setCategory, setError } = useContext(AppContext);
  const [categories, setCategories] = useState(false);

  useEffect(() => {
    getCategories(setCategories, setError);
  }, []);

  return (
    <>
      <div className="text-center text-lg my-2">Select Categories</div>
      <div className="max-w-screen-lg text-white my-4 mx-auto grid grid-cols-2 gap-4 justify-items-center px-6">
        {categories &&
          categories.map((cat, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  setCategory(cat);
                }}
                className={`w-full text-center py-[10%] text-xl rounded-md px-2 ${
                  category.id === cat.id
                    ? "bg-indigo-900"
                    : `bg-gradient-to-br from-indigo-800 from-40% via-indigo-400 via-80%`
                }`}
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
