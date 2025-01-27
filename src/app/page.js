"use client";
import { useEffect, useState } from "react";
import nookies from "nookies";
import "./globals.css";
import toast from "react-hot-toast";
import Loading from "./components/Loading";

export default function Home() {
  const [lastScore, setLastScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = nookies.get();
    setLastScore(cookies.coins || null);
  }, []);

  const handleStartGame = (difficulty) => {
    nookies.set(null, "difficulty", difficulty, { path: "/" });
    toast.success(`Game Difficulty set to ${difficulty}`);
    setTimeout(() => {
      window.location.href = "/game";
    }, 1500);
  };

  const imagesToLoad = [
    "/images/1.jpg",
  ];

  const preloadImages = (imageArray) => {
    return Promise.all(
      imageArray.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
        });
      })
    );
  };

  useEffect(() => {
    preloadImages(imagesToLoad).then(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="overflow-hidden">
    <main className="main-container flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 text-white p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center mt-10">
        Welcome to <span className="text-black">GeoExplorer</span> <span className="text-[#12354f]">Trivia</span>
      </h1>

      {lastScore ? (
        <p className="mb-4 text-lg md:text-xl">
          Welcome back! Your last score was{" "}
          <span className="font-bold underline">{lastScore}</span>. Can you beat
          it?
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

        <p className="text-center text-gray-500 font-bold">
        Answer Fast, Earn Big: Your Speed Unlocks the Treasure!
        </p>
      </div>

      <footer className="mt-12 text-sm text-gray-200">
        © 2025 GeoExplorer Trivia. All rights reserved.
      </footer>
    </main>
    </div>
  );
}
