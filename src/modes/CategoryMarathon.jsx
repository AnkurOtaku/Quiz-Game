import React, { useState, useEffect, useContext } from "react";
import Category from "../components/Category";
import Difficulty from "../components/Difficulty";
import { AppContext } from "../store/store";
import Quiz from "../components/Quiz";

const getQuestionCount = async (category, setError, difficulty) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api_count.php?category=${category.id}`
    );
    const data = await response.json();

    if (data.response_code !== 0) {
      setError(data.response_code);
      return null;
    }

    let number_of_questions;
    switch (difficulty) {
      case 0:
        number_of_questions = data.category_question_count.total_question_count;
        break;
      case 1:
        number_of_questions =
          data.category_question_count.total_easy_question_count;
        break;
      case 2:
        number_of_questions =
          data.category_question_count.total_medium_question_count;
        break;
      case 3:
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

const getQuestions = async (category, count, setError, setQuiz, token) => {
  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=${count}&category=${category.id}&token=${token}`
    );
    const data = await response.json();

    if (data.response_code !== 0) {
      setError(data.response_code);
      return null;
    }
    setQuiz(data.results);
  } catch (error) {
    console.error(error);
  }
};

function CategoryMarathon() {
  const { category, setError, difficulty, token } =
    useContext(AppContext);
  const [quiz, setQuiz] = useState(false);

  useEffect(() => {
    let count;
    category && (count = getQuestionCount(category, setError, difficulty));
    count && getQuestions(category, count, setError, setQuiz, token);
  }, [difficulty]);

  return (
    <>
      {!category ? (
        <Category />
      ) : !difficulty ? (
        <Difficulty />
      ) : quiz ? (
        <Quiz quiz={quiz} />
      ) : (
        ""
      )}
    </>
  );
}

export default CategoryMarathon;
