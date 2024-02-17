import React, { useContext } from "react";
import { AppContext } from "../store/store";
import Quiz from "../components/Quiz";

function Favourates() {
  const { favourates } = useContext(AppContext);

  if (favourates.length === 0) {
    return (
      <div className="w-full mt-4 px-2">
        <div className="text-center font-bold">No questions in favourates.</div>
        <div className="text-center text-pretty">Play other game modes and add question to favourates to make a quiz from
        your favourate questions only.</div>
      </div>
    );
  }
  return (<Quiz quiz={favourates}/>);
}

export default Favourates;
