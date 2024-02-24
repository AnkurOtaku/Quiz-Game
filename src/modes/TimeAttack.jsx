import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../store/store";
import Category from "../components/Category";
import Quiz from "../components/Quiz";
import { useNavigate } from "react-router-dom";

const getQuiz = async (category, setError, setQuiz, token, navigate) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=20&category=${category.id}${
        token ? `&token=${token}` : ""
      }`
    );
    const data = await response.json();

    if (data.response_code !== 0) {
      setError(data.response_code);
      navigate("/error");
      return null;
    }
    setQuiz(data.results);
  } catch (error) {
    console.error(error);
  }
};

function TimeAttack() {
  const { category, setError, token } = useContext(AppContext);
  const [quiz, setQuiz] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    category && getQuiz(category, setError, setQuiz, token, navigate);
  }, [category])
  

  return category ? quiz.length>0 && <Quiz quiz={quiz} time={true} /> : <Category />;
}

export default TimeAttack;
