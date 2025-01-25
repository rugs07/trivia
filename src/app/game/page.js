"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import nookies from "nookies";

const GamePage = () => {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const cookies = nookies.get();
    const savedScore = parseInt(cookies.score || "0", 10);
    setScore(savedScore)
    fetchRandomQuestion();
  }, []);

  const fetchRandomQuestion = async () => {
    const res = await fetch("https://restcountries.com/v3.1/all");
    const countries = await res.json();
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];

    setQuestion(randomCountry);
    setOptions(generateOptions(randomCountry, countries));
  };

  const generateOptions = (correct, countries) => {
    const options = [correct.name.common];
    while (options.length < 4) {
      const randomOption = countries[Math.floor(Math.random() * countries.length)].name.common;
      if (!options.includes(randomOption)) options.push(randomOption);
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer) => {
    let updatedScore = score; // Initialize a variable to hold the updated score
  
    if (answer === question.name.common) {
      updatedScore += 10; // Correct answer increases score
      Swal.fire({
        title: "🎉 Correct Answer!",
        text: `Awesome! You've earned 10 points.`,
        icon: "success",
        confirmButtonText: "Next Question",
        customClass: {
          confirmButton: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
        },
      }).then(() => {
        fetchRandomQuestion();
        nookies.set(null, "score", updatedScore.toString(), { path: "/" });
      });
    } else {
      updatedScore -= 5; // Incorrect answer decreases score
      Swal.fire({
        title: "❌ Wrong Answer!",
        text: `The correct answer was ${question.name.common}. Keep trying!`,
        icon: "error",
        confirmButtonText: "Try Again",
        customClass: {
          confirmButton: "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
        },
      }).then(() => {
        fetchRandomQuestion();
        nookies.set(null, "score", updatedScore.toString(), { path: "/" });
      });
    }
  
    setScore(updatedScore); // Update state with the correct score
  };
  
  if (!question) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      {/* <h1 className="text-4xl font-bold text-white mb-8">GeoExplorer Trivia</h1> */}
      <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Guess the Country!</h2>
        <div className="mb-6">
          <img
            src={question.flags.svg}
            alt={`Flag of ${question.name.common}`}
            className="w-40 h-24 object-cover mx-auto rounded-md shadow"
          />
        </div>
        <ul className=" grid grid-cols-2 gap-4">
          {options.map((option) => (
            <li key={option}>
              <button
                onClick={() => handleAnswer(option)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:scale-105 transition-transform"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-gray-700 text-lg font-medium text-center">
          Current Score: <span className="text-blue-600 font-bold">{score}</span>
        </p>
      </div>
    </div>
  );
};

export default GamePage;
