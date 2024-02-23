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
import Favourates from "./modes/Favourates";
import Navbar from "./components/Navbar";
import Error from "./components/Error.jsx";
import { AppProvider } from "./store/store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Navbar />}>
        <Route path="" element={<App />} />
        <Route path="category_marathon" element={<CategoryMarathon />} />
        <Route path="time_attack" element={<TimeAttack />} />
        <Route path="random_quiz" element={<RandomQuiz />} />
        <Route path="favourates" element={<Favourates />} />
        <Route path="error" element={<Error/>}/>
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
