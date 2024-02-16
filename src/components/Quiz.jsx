function Quiz({quiz}) {

  console.log(quiz);

  return (
    <>
      {" "}
      {quiz && quiz.map((question) => {
        return (
          <>
            <div>{question.question}</div>
          </>
        );
      })}
    </>
  );
}

export default Quiz;
