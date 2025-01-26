"use client";

import React, { useState, useEffect, Fragment } from "react";
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
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy leaderboard data
  const dummyLeaderboard = [
    { name: "Alice", score: 450, rank: 1 },
    { name: "Bob", score: 400, rank: 2 },
    { name: "Charlie", score: 350, rank: 3 },
    { name: "David", score: 300, rank: 4 },
    { name: "Eve", score: 280, rank: 5 },
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

    setScore(savedScore);
    setQuestionsAnswered(answered);
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
        toast.success("Score Reset Successfully");
        nookies.set(null, "coins", 0, { path: "/" });
      }
    });
  };

  const tableRows = tableInstance.getRowModel().rows;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-col items-center justify-center pt-10">
      <h1 className="text-4xl font-bold text-white mt-3 mb-3">Dashboard</h1>
      <div className="flex gap-2 w-full p-2">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full md:w-1/3">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Stats
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Current Score:</strong>{" "}
            <span className="text-blue-600">{score}</span>
          </p>
          <p className="text-lg text-gray-700 mb-6">
            <strong>Questions Answered:</strong>{" "}
            <span className="text-green-600">{questionsAnswered}</span>
          </p>
          <button
            onClick={resetProgress}
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-transform"
          >
            Reset Progress
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-2xl w-full  md:w-2/3">
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
                    className={
                      row.original.name === "Alice" ? "bg-blue-100" : ""
                    }
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
