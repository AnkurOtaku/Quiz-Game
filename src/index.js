import * as React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import CategoryMarathon from "./modes/CategoryMarathon";
import RandomQuiz from "./modes/RandomQuiz";
import TimeAttack from "./modes/TimeAttack";
import Quiz from "./modes/Quiz.jsx";
import QuizReview from "./modes/QuizReview.jsx";
import Favourates from "./modes/Favourates";
import Navbar from "./components/Navbar";
import CreateQuiz from "./modes/CreateQuiz.jsx";
import Error from "./components/Error.jsx";
import RouteError from "./components/RouteError.jsx";
import { AppProvider } from "./store/store.js";
import TestLuck from "./modes/TestLuck.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
        <Route path="" element={<App />} />
        <Route path="category_marathon" element={<CategoryMarathon />} />
        <Route path="time_attack" element={<TimeAttack />} />
        <Route path="random_quiz" element={<RandomQuiz />} />
        <Route path="favourates" element={<Favourates />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="quiz/review" element={<QuizReview />} />
        <Route path="create_quiz" element={<CreateQuiz/>} />
        <Route path="test_luck" element={<TestLuck/>}/>
        <Route path="error" element={<Error/>}/>
        <Route path="*" element={<RouteError/>}/>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
