"use client";
import { useEffect, useState } from "react";
import nookies from "nookies";
import "./globals.css";

export default function Home() {
  const [lastScore, setLastScore] = useState(null);

  useEffect(() => {
    const cookies = nookies.get();
    setLastScore(cookies.coins || null);
  }, []);

  const handleStartGame = (difficulty) => {
    nookies.set(null, "difficulty", difficulty, { path: "/" });
    window.location.href = "/game";
  };

  return (
    <main className="main-container flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 text-white p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Welcome to GeoExplorer Trivia
      </h1>

      {lastScore ? (
        <p className="mb-4 text-lg md:text-xl">
          Welcome back! Your last score was{" "}
          <span className="font-bold underline">{lastScore}</span>. Can you beat it?
        </p>
      ) : (
        <p className="mb-4 text-lg md:text-xl">
          Test your knowledge about countries and explore the world through
          trivia!
        </p>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800 w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">
          Choose Difficulty
        </h2>

        <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 mb-6">
          <button
            className="w-full md:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 z-10 text-white rounded mb-2 md:mb-0"
            onClick={() => handleStartGame("easy")}
          >
            Easy
          </button>
          <button
            className="w-full md:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded mb-2 md:mb-0"
            onClick={() => handleStartGame("medium")}
          >
            Medium
          </button>
          <button
            className="w-full md:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={() => handleStartGame("hard")}
          >
            Hard
          </button>
        </div>

        <p className="text-center text-gray-500">
          Your score will be saved, and you can pick up where you left off!
        </p>
      </div>

      <footer className="mt-12 text-sm text-gray-200">
        © 2025 GeoExplorer Trivia. All rights reserved.
      </footer>
    </main>
  );
}
