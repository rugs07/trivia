"use client";

import React, { useState, useEffect } from "react";
import nookies from "nookies";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

const DashboardPage = () => {
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const dummyLeaderboard = [
    { name: "Rohan", score: 450, rank: 1 },
    { name: "Sreenivas", score: 400, rank: 2 },
    { name: "Sarthak", score: 350, rank: 3 },
    { name: "John", score: 300, rank: 4 },
    { name: "Kiara", score: 280, rank: 5 },
    { name: "You", score, rank: 6 },
  ];

  const columns = [
    { accessorKey: "rank", header: "Rank" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "score", header: "Score" },
  ];

  const tableInstance = useReactTable({
    data: dummyLeaderboard.filter((row) =>
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    columns,
    state: {
      sorting: [],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    const cookies = nookies.get();
    const savedScore = parseInt(cookies.coins || "0", 10); // Get score from cookies
    const answered = parseInt(cookies.questionsAnswered || "0", 10);
    const savedHighestScore = parseInt(cookies.highestScore || "0", 10);
    const savedLastGameDate = cookies.lastGameDate || null;

    // Retrieve correct and incorrect answers
    const savedCorrectAnswers = parseInt(cookies.correctAnswers || "0", 10);
    const savedIncorrectAnswers = parseInt(cookies.incorrectAnswers || "0", 10);

    setScore(savedScore);

    // Set correct and incorrect answers
    setCorrectAnswers(savedCorrectAnswers);
    setIncorrectAnswers(savedIncorrectAnswers);

    // Calculate average score (for demo purposes)
    if (answered > 0) {
      setAverageScore((savedScore / answered).toFixed(2));
    }
  }, []);

  const resetProgress = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will reset your score and progress.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset it!",
      cancelButtonText: "No, keep it",
      customClass: {
        confirmButton:
          "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
        cancelButton:
          "bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setScore(0);
        setCorrectAnswers(0);
        setIncorrectAnswers(0);
        toast.success("Progress Reset Successfully");
        nookies.set(null, "coins", 0, { path: "/" });
        nookies.set(null, "questionsAnswered", 0, { path: "/" });
        nookies.set(null, "highestScore", 0, { path: "/" });
        nookies.set(null, "lastGameDate", null, { path: "/" });
        nookies.set(null, "correctAnswers", 0, { path: "/" });
        nookies.set(null, "incorrectAnswers", 0, { path: "/" });
      }
    });
  };

  const tableRows = tableInstance.getRowModel().rows;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-col items-center justify-center pt-10">
      <h1 className="text-4xl font-bold text-white mt-3 mb-3">Dashboard</h1>
      <div className="flex gap-4 w-full p-4">
        {/* User Stats Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full md:w-1/3 transition-transform transform hover:-translate-y-1 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Stats
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Current Coins:</strong>{" "}
            <span className="text-blue-600">{score}</span>
          </p>

          <p className="text-lg text-gray-700 mb-4">
            <strong>Correct Answers:</strong>{" "}
            <span className="text-green-600">{correctAnswers}</span>
          </p>
          <p className="text-lg text-gray-700 mb-6">
            <strong>Incorrect Answers:</strong>{" "}
            <span className="text-red-600">{incorrectAnswers}</span>
          </p>

          <button
            onClick={resetProgress}
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-transform"
          >
            Reset Progress
          </button>
        </div>

        {/* Leaderboard Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg w-full md:w-2/3 transition-transform transform hover:-translate-y-1 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Leaderboard
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-left">
              <thead>
                <tr className="bg-gray-100">
                  {tableInstance.getHeaderGroups().map((headerGroup) => (
                    <React.Fragment key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="py-2 px-4 border-b border-gray-300"
                        >
                          {header.column.columnDef.header}
                        </th>
                      ))}
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`transition-colors duration-200 ${
                      row.original.name === "You" ? "bg-blue-100" : ""
                    } hover:bg-gray-50`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-2 px-4 border-b border-gray-300"
                      >
                        {cell.getValue()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
