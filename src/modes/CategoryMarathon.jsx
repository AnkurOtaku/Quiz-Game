import React, { useState, useEffect, useContext } from "react";
import Category from "../components/Category";
import Difficulty from "../components/Difficulty";
import { AppContext } from "../store/store";
import Quiz from "../components/Quiz";
import { useNavigate } from "react-router-dom";

const getQuestionCount = async (
  category,
  difficulty,
  setQuestionCount,
  setError,
  navigate
) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api_count.php?category=${category.id}`
    );
    const data = await response.json();
    if (data.response_code !== 0) {
      setError(data.response_code);
      navigate("/error");
      return null;
    }
    setQuestionCount(data.category_question_count);

    let number_of_questions;
    switch (difficulty) {
      case "mixed":
        number_of_questions = data.category_question_count.total_question_count;
        break;
      case "easy":
        number_of_questions =
          data.category_question_count.total_easy_question_count;
        break;
      case "medium":
        number_of_questions =
          data.category_question_count.total_medium_question_count;
        break;
      case "hard":
        number_of_questions =
          data.category_question_count.total_hard_question_count;
        break;
      default:
        console.log("unexpected diffuculty value");
        break;
    }
    return number_of_questions;
  } catch (error) {
    console.error(error);
  }
};

const getQuiz = async (
  category,
  count,
  difficulty,
  setError,
  setQuiz,
  token,
  navigate
) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${count}&category=${category.id}${
        difficulty !== "mixed" ? `&difficulty=${difficulty}` : ""
      }${token ? `&token=${token}` : ""}`
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

function CategoryMarathon() {
  const { category, setError, difficulty, token } = useContext(AppContext);
  const [quiz, setQuiz] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (category) {
        try {
          const count = await getQuestionCount(
            category,
            difficulty,
            setQuestionCount,
            setError,
            navigate
          );
          if (count && category && difficulty) {
            getQuiz(
              category,
              count,
              difficulty,
              setError,
              setQuiz,
              token,
              navigate
            );
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [difficulty, category]);

  return (
    <>
      {!category ? (
        <Category />
      ) : !difficulty ? (
        <Difficulty questionCount={questionCount} />
      ) : quiz ? (
        <Quiz quiz={quiz} />
      ) : (
        ""
      )}
    </>
  );
}

export default CategoryMarathon;
