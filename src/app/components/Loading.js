import React from "react";
import '../globals.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-squares">
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
      </div>
      <p className="loading-text">Loading Please wait...</p>
    </div>
  );
};

export default Loading;
