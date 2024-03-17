import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function fetchData() {
    const eventSource = new EventSource("http://localhost:4000/api/data");

    eventSource.onmessage = function (event) {
      console.log(event.data);
      setProgress(event.data);
    };

    eventSource.onerror = function (event) {
      console.log("Client connection closed");
      eventSource.close();
    };
    // setIsLoading(true);
    // setProgress(0); // Reset progress before each request
    // setError(null); // Clear any previous errors

    // try {
    //   console.log("1");
    //   const eventSource = new EventSource("http://localhost:4000/api/data");
    //   setIsLoading(false);
    //   console.log("1p: ", eventSource);
    //   eventSource.onmessage = (event) => {
    //     console.log("2");
    //     const progressValue = parseInt(event.data);
    //     setProgress(progressValue);
    //   };
    //   eventSource.onerror = (error) => {
    //     console.log("3");
    //     console.error(error);
    //     setError(error.message || "An error occurred"); // Handle potential error messages
    //   };
    // } finally {
    //   console.log("4");
    //   setIsLoading(false);
  }

  const renderProgress = () => {
    if (isLoading) {
      return (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get Data"}
      </button>
      {error && <p className="error-message">{error}</p>}
      {data && <p>Data: {JSON.stringify(data)}</p>}
      {renderProgress()}
    </div>
  );
}

export default App;
