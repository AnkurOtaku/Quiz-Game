// src/pages/PYQ.jsx
import { useNavigate } from "react-router-dom";

function PYQ() {
  const navigate = useNavigate();
  const years = [2025, 2024, 2023, 2022];

  return (
    <div className="grid grid-cols-2 gap-6">
      {years.map(year => (
        <button
          key={year}
          onClick={() => navigate(`/pyq/${year}`)}
          className="p-8 bg-indigo-800 text-white rounded-xl text-2xl hover:bg-indigo-500"
        >
          MCA {year} PYQ
        </button>
      ))}
    </div>
  );
}

export default PYQ;