import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./App.css";

function New() {
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setProgress(0); // Reset progress before each request
    setError(null); // Clear any previous errors

    try {
      const response = await new Promise((resolve, reject) => {
        const eventSource = new EventSource("http://localhost:4000/api/data");
        eventSource.onmessage = (event) => {
          if (event.data === "Done") {
            resolve(); // Resolve promise on completion
          } else {
            const progressValue = parseInt(event.data);
            setProgress(progressValue);
          }
        };
        eventSource.onerror = (error) => {
          reject(error); // Reject promise on error
        };
      });
      setData(response.data); // Assuming data is sent after progress updates
    } catch (error) {
      console.error(error);
      setError(error.message || "An error occurred"); // Handle potential errors
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      // No explicit cleanup needed for SSE connections (browser handles closing)
    };
  }, []);

  const handleCancel = () => {
    // For WebSockets:
    if (socket.connected) {
      socket.disconnect(); // Disconnect from the WebSocket server
    }

    // For SSE (no explicit cancellation needed)
    //  - The browser automatically closes the EventSource connection when the component unmounts
  };

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? "Loading..." : "Get Data"}
      </button>
      {error && <p className="error-message">{error}</p>}
      {isLoading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      {data && <p>Data: {JSON.stringify(data)}</p>}
      <button onClick={handleCancel} disabled={!isLoading}>
        Cancel
      </button>
    </div>
  );
}

export default New;
