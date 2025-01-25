"use client"
import { useEffect, useState } from "react";
import nookies from "nookies";


export default function Home() {
  const [lastScore, setLastScore] = useState(null);

  useEffect(() => {
    const cookies = nookies.get();
    setLastScore(cookies.lastScore || null);
  }, []);

  const handleStartGame = (difficulty) => {
    nookies.set(null, "difficulty", difficulty, { path: "/" });
    window.location.href = "/game";
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to GeoExplorer Trivia</h1>

      {lastScore ? (
        <p className="mb-4 text-lg">
          Welcome back! Your last score was{" "}
          <span className="font-bold">{lastScore}</span>. Can you beat it?
        </p>
      ) : (
        <p className="mb-4 text-lg">
          Test your knowledge about countries and explore the world through trivia!
        </p>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 text-gray-800">
        <h2 className="text-2xl font-semibold mb-4 text-center">Choose Difficulty</h2>

        <div className="flex justify-center space-x-4 mb-6">
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
            onClick={() => handleStartGame("easy")}
          >
            Easy
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
            onClick={() => handleStartGame("medium")}
          >
            Medium
          </button>
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
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
