"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import nookies from "nookies";
import Loading from "../components/Loading";

const GamePage = () => {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // New state for correct answers
  const [incorrectAnswers, setIncorrectAnswers] = useState(0); // New state for incorrect answers
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = nookies.get();
    const savedCoins = parseInt(cookies.coins || "0", 10);
    const savedCorrectAnswers = parseInt(cookies.correctAnswers || "0", 10);
    const savedIncorrectAnswers = parseInt(cookies.incorrectAnswers || "0", 10);

    setCoins(savedCoins);
    setCorrectAnswers(savedCorrectAnswers);
    setIncorrectAnswers(savedIncorrectAnswers);

    fetchRandomQuestion();
  }, []);

  const fetchRandomQuestion = async () => {
    try {
      console.log("loading called");
      setLoading(true);
      const res = await fetch("https://restcountries.com/v3.1/all");
      const countries = await res.json();
      const randomCountry =
        countries[Math.floor(Math.random() * countries.length)];

      setQuestion(randomCountry);
      setOptions(generateOptions(randomCountry, countries));
    } catch (error) {
      console.log(error, "Error Loading Data");
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

  console.log(loading, "loading component");

  const handleAnswer = (answer) => {
    let updatedCoins = coins;

    if (answer === question.name.common) {
      updatedCoins += 15;
      Swal.fire({
        title: "🎉 Correct Answer!",
        text: "Awesome! You've earned 15 coins.",
        icon: "success",
        confirmButtonText: "Next Question",
        customClass: {
          confirmButton:
            "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700",
        },
      }).then(() => {
        setCorrectAnswers(correctAnswers + 1);
        nookies.set(null, "correctAnswers", (correctAnswers + 1).toString(), {
          path: "/",
        });

        fetchRandomQuestion();
        nookies.set(null, "coins", updatedCoins.toString(), { path: "/" });
      });
    } else {
      updatedCoins -= 5;
      Swal.fire({
        title: "❌ Wrong Answer!",
        text: `The correct answer was ${question.name.common}. Keep trying!`,
        icon: "error",
        confirmButtonText: "Try Again",
        customClass: {
          confirmButton:
            "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
        },
      }).then(() => {
        // Update incorrect answers count
        setIncorrectAnswers(incorrectAnswers + 1);
        nookies.set(
          null,
          "incorrectAnswers",
          (incorrectAnswers + 1).toString(),
          { path: "/" }
        );

        fetchRandomQuestion();
        nookies.set(null, "coins", updatedCoins.toString(), { path: "/" });
      });
    }

    setCoins(updatedCoins);
  };

  const handleHint = () => {
    if (coins >= 10) {
      Swal.fire({
        title: "Hint!",
        text: `The capital of ${question.name.common} is ${question.capital[0]}.`,
        icon: "info",
        confirmButtonText: "Got it!",
      });
      setCoins(coins - 10);
      nookies.set(null, "coins", (coins - 10).toString(), { path: "/" });
    } else {
      Swal.fire({
        title: "Not Enough Coins!",
        text: "You need at least 10 coins to use a hint.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <>
      {loading && <Loading />}
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
        <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-md mt-[70px]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Guess the Country!
          </h2>
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
                  style={{ maxHeight: "60px" }} // Adjust height as needed
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
            Use Hint (Cost: 10 coins)
          </button>
          <p className="mt-6 text-gray-700 text-lg justify-center font-medium text-center flex items-center gap-2">
            Current Coins:{" "}
            <img src="/images/coin2.png" className="w-6 h-6" alt="coin" />
            <span className="text-blue-600 font-bold">{coins}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default GamePage;
