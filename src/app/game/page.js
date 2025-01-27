"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import nookies from "nookies";
import Loading from "../components/Loading";

const GamePage = () => {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("easy");
  const [timer, setTimer] = useState(30); // Timer for medium and hard modes
  const [isFirstQuestion, setIsFirstQuestion] = useState(true); // Track if it's the first question

  useEffect(() => {
    const cookies = nookies.get();
    const savedCoins = parseInt(cookies.coins || "0", 10);
    const savedCorrectAnswers = parseInt(cookies.correctAnswers || "0", 10);
    const savedIncorrectAnswers = parseInt(cookies.incorrectAnswers || "0", 10);
    const savedDifficulty = cookies.difficulty || "easy";

    setCoins(savedCoins);
    setCorrectAnswers(savedCorrectAnswers);
    setIncorrectAnswers(savedIncorrectAnswers);
    setDifficulty(savedDifficulty);

    fetchRandomQuestion();
  }, []);

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !isFirstQuestion) {
      handleTimeOut();
    }
    return () => clearInterval(countdown);
  }, [timer, isFirstQuestion, difficulty]);

  const fetchRandomQuestion = async () => {
    try {
      setLoading(true);
      const initialTimer =
        difficulty === "easy" ? 0 : difficulty === "medium" ? 30 : 15;

      if (!isFirstQuestion) {
        setTimer(initialTimer);
      }
      const res = await fetch("https://restcountries.com/v3.1/all");
      const countries = await res.json();
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];

      setQuestion(randomCountry);
      setOptions(generateOptions(randomCountry, countries));

      if (isFirstQuestion) {
        setIsFirstQuestion(false);
      }
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  const generateOptions = (correct, countries) => {
    const options = [correct.name.common];
    while (options.length < 4) {
      const randomOption =
        countries[Math.floor(Math.random() * countries.length)].name.common;
      if (!options.includes(randomOption)) options.push(randomOption);
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer) => {
    const initialTime = difficulty === "medium" ? 30 : difficulty === "hard" ? 15 : 0;
    const timeTaken = initialTime - timer; 
  
    let updatedCoins = coins;
  
    if (answer === question.name.common) {
      let reward = 0;
  
      if (difficulty === "medium") {
        if (timeTaken <= 10) reward = 15;
        else if (timeTaken <= 20) reward = 10;
        else reward = 5;
      } else if (difficulty === "hard") {
        if (timeTaken <= 5) reward = 20;
        else if (timeTaken <= 10) reward = 15;
        else reward = 10;
      } else {
        reward = 10;
      }
  
      updatedCoins += reward;
      Swal.fire({
        title: "🎉 Correct Answer!",
        text: `Awesome! You've earned ${reward} coins.`,
        icon: "success",
        confirmButtonText: "Next Question",
      }).then(() => {
        setCorrectAnswers((prev) => prev + 1);
        nookies.set(null, "correctAnswers", (correctAnswers + 1).toString(), {
          path: "/",
        });
  
        fetchRandomQuestion();
        nookies.set(null, "coins", updatedCoins.toString(), { path: "/" });
        resetTimer();
      });
    } else {
      const penalty =
        difficulty === "easy"
          ? 5
          : difficulty === "medium"
          ? 10
          : difficulty === "hard"
          ? 15
          : 0;
  
      updatedCoins -= penalty;
      Swal.fire({
        title: "❌ Wrong Answer!",
        text: `The correct answer was ${question.name.common}. You lost ${penalty} coins.`,
        icon: "error",
        confirmButtonText: "Try Again",
      }).then(() => {
        setIncorrectAnswers((prev) => prev + 1);
        nookies.set(
          null,
          "incorrectAnswers",
          (incorrectAnswers + 1).toString(),
          { path: "/" }
        );
  
        fetchRandomQuestion();
        nookies.set(null, "coins", updatedCoins.toString(), { path: "/" });
        resetTimer();
      });
    }
  
    setCoins(updatedCoins);
  };
  
  const resetTimer = () => {
    setTimer(difficulty === "medium" ? 30 : difficulty === "hard" ? 15 : 0);
  };

  const handleTimeOut = () => {
    const penalty =
      difficulty === "medium" ? 10 : difficulty === "hard" ? 15 : 0;
    if (difficulty !== "easy") {
      Swal.fire({
        title: "⏰ Time's Up!",
        text: `You ran out of time and lost ${penalty} coins.`,
        icon: "error",
        confirmButtonText: "Next Question",
      }).then(() => {
        setIncorrectAnswers((prev) => prev + 1);
        nookies.set(
          null,
          "incorrectAnswers",
          (incorrectAnswers + 1).toString(),
          { path: "/" }
        );

        setCoins((prev) => prev - penalty);
        nookies.set(null, "coins", (coins - penalty).toString(), { path: "/" });
        fetchRandomQuestion();
      });
    }
  };

  const handleHint = () => {
    const cost = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15;
  
    if (coins >= cost) {
      Swal.fire({
        title: "💡 Hint!",
        text: `The capital of ${question.name.common} is ${question.capital[0]}.`,
        icon: "info",
        confirmButtonText: "Got it!",
      }).then(() => {
        const updatedCoins = coins - cost;
        setCoins(updatedCoins);
        nookies.set(null, "coins", updatedCoins.toString(), { path: "/" });
      });
    } else {
      Swal.fire({
        title: "❌ Not Enough Coins!",
        text: `You need at least ${cost} coins to use a hint. Try answering questions to earn more!`,
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
  };
  
  const hintCost = difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 15

  if (!question) return <div>Loading...</div>;

  return (
    <>
      {loading && <Loading />}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
        <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-md mt-[70px]">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">
            Guess the Country!
          </h2>
          {difficulty !== "easy" && (
            <p className="text-center text-red-600 font-bold mb-2">
              {isFirstQuestion
                ? "This question has no timer."
                : `Time Left: ${timer}s`}
            </p>
          )}
          <div className="mb-6">
            <img
              src={question.flags.svg}
              alt={`Flag of ${question.name.common}`}
              className="w-40 h-24 object-cover mx-auto rounded-md shadow"
            />
          </div>
          <ul className="grid grid-cols-2 gap-4">
            {options.map((option) => (
              <li key={option}>
                <button
                  onClick={() => handleAnswer(option)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg hover:scale-105 transition-transform overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ maxHeight: "60px" }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={handleHint}
            className="mt-4 w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
          >
             Use Hint (Cost: {hintCost} coins)
          </button>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className=" text-gray-700 text-lg text-center items-center flex justify-center">
                Coins:
                <img src="/images/coin2.png" className="w-7 h-7 mx-2"></img>
                {coins}
              </p>
            </div>
            <div className="bg-black p-2 rounded-lg text-white px-4 cursor-pointer hover:bg-[#242424] transition-colors" onClick={() => window.location.href = "/"}>Stop Game</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GamePage;
