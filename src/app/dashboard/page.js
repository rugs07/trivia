"use client";

import React, { useState, useEffect, useRef } from "react";
import nookies from "nookies";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import * as echarts from "echarts";

const InstanceStats = ({ correctAnswers, incorrectAnswers }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    const option = {
      tooltip: {
        trigger: "item",
      },

      series: [
        {
          name: "Answers",
          type: "pie",
          radius: ["62%", "95%"],

          avoidLabelOverlap: false,
          label: {
            show: false,
          },
          emphasis: {
            label: {
              fontSize: 18,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: correctAnswers,
              name: "Correct",
              itemStyle: { color: "#FBDB86" },
            },
            {
              value: incorrectAnswers,
              name: "Incorrect",
              itemStyle: { color: "#000" },
            },
          ],
        },
      ],
    };

    chartInstance.setOption(option);

    const resizeChart = () => {
      chartInstance.resize();
    };
    window.addEventListener("resize", resizeChart);

    return () => {
      window.removeEventListener("resize", resizeChart);
      chartInstance.dispose();
    };
  }, [correctAnswers, incorrectAnswers]);

  return (
    <div className="flex items-center justify-between w-full">
      <div
        ref={chartRef}
        style={{ width: "50%", height: "200px" }}
        className="relative"
      ></div>

      <div className="ml-4 flex flex-col gap-2 text-left">
        <p className="text-lg text-gray-700">
          <strong>Correct Ans:</strong>{" "}
          <span className="text-[#000] font-bold">{correctAnswers}</span>
        </p>
        <p className="text-lg text-gray-700">
          <strong>Incorrect Ans:</strong>{" "}
          <span className="text-[#000] font-bold ">{incorrectAnswers}</span>
        </p>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const dummyLeaderboard = [
    { name: "Rohan", score: 450, rank: 1 },
    { name: "Sreenivas", score: 400, rank: 2 },
    { name: "kamal", score: 350, rank: 3 },
    { name: "John", score: 300, rank: 4 },
    { name: "Shivam", score: 280, rank: 5 },
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
    const savedScore = parseInt(cookies.coins || "0", 10);
    const answered = parseInt(cookies.questionsAnswered || "0", 10);

    const savedCorrectAnswers = parseInt(cookies.correctAnswers || "0", 10);
    const savedIncorrectAnswers = parseInt(cookies.incorrectAnswers || "0", 10);

    setScore(savedScore);

    setCorrectAnswers(savedCorrectAnswers);
    setIncorrectAnswers(savedIncorrectAnswers);

    if (answered > 0) {
      setAverageScore((savedScore / answered).toFixed(2));
    }
  }, []);

  // const resetProgress = async () => {
  //   const result = await Swal.fire({
  //     title: "Are you sure?",
  //     text: "This will reset your score and progress.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, reset it!",
  //     cancelButtonText: "No, keep it",
  //     customClass: {
  //       confirmButton:
  //         "bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700",
  //       cancelButton:
  //         "bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700",
  //     },
  //   });

  //   if (result.isConfirmed) {
  //     console.log("Resetting progress...");
  //     setScore(0);
  //     setCorrectAnswers(0);
  //     setIncorrectAnswers(0);

  //     toast.success("Progress Reset Successfully");

  //     nookies.set(null, "coins", 0, { path: "/" });
  //     nookies.set(null, "correctAnswers", 0, { path: "/" });
  //     nookies.set(null, "incorrectAnswers", 0, { path: "/" });

  //     navigate("/");
  //   }
  // };

  const tableRows = tableInstance.getRowModel().rows;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-col items-center justify-center pt-10">
      <h1 className="text-4xl font-bold text-white mt-8 mb-1">Dashboard</h1>
      <div className="flex gap-4 w-full p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full md:w-1/3 transition-transform transform hover:-translate-y-1 hover:shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Your Stats -
          </h2>
          <p className="text-lg text-gray-700 font-semibold">
            Performance -{" "}
            <span className="font-bold italic">
              {score < 0
                ? "You need to improve!"
                : score <= 50
                ? "You're doing average!"
                : "Great job! Keep it up!"}
            </span>
          </p>
          <p className="text-lg text-gray-700">
            <strong>Current Coins:</strong>{" "}
            <span className="text-[#000] font-bold">{score}</span>
          </p>
          <p className="text-[18px] text-gray-700">
            <strong>Percentage:</strong>{" "}
            <span className="text-[#000] font-bold">
              {correctAnswers === 0 && incorrectAnswers === 0 ? (
                <span className="text-[#000]">0% </span>
              ) : (
                (
                  (Number(correctAnswers) /
                    (Number(correctAnswers) + Number(incorrectAnswers))) *
                  100
                ).toFixed(2) + "%"
              )}
              <span className="text-[15px] text-[#6c6c6c]"> Correct</span>
            </span>
          </p>

          <InstanceStats
            correctAnswers={correctAnswers}
            incorrectAnswers={incorrectAnswers}
          />
          <button
            className="bg-[#F2EDFF] mt-2 p-2 w-full text-black border border-[#1a1a1a] font-bold italic rounded"
            onClick={() => (window.location.href = "/")}
          >
            Change Difficulty
          </button>
          {/* <button
            onClick={resetProgress}
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-transform"
          >
            Reset Progress
          </button> */}
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
                        className="py-2 px-4 border-b border-gray-300 text-[#535353] font-semibold"
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
