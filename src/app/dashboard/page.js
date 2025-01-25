"use client";

import { useState, useEffect } from "react";
import nookies from "nookies";

const DashboardPage = () => {
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    const cookies = nookies.get();
    const savedScore = parseInt(cookies.score || "0", 10); // Get score from cookies
    const answered = parseInt(cookies.questionsAnswered || "0", 10)

    console.log(localStorage,"savedscore")

    setScore(savedScore);
    setQuestionsAnswered(answered);
  }, []);

  const resetProgress = () => {
    localStorage.setItem("score", "0");
    localStorage.setItem("questionsAnswered", "0");
    setScore(0);
    setQuestionsAnswered(0);
    alert("Progress reset successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-col items-center justify-center pt-10">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Stats</h2>
        <p className="text-lg text-gray-700 mb-4">
          <strong>Current Score:</strong> <span className="text-blue-600">{score}</span>
        </p>
        <p className="text-lg text-gray-700 mb-6">
          <strong>Questions Answered:</strong> <span className="text-green-600">{questionsAnswered}</span>
        </p>
        <button
          onClick={resetProgress}
          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-transform"
        >
          Reset Progress
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
