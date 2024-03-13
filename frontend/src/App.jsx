import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "./App.css";

function App() {
  const URL = "http://localhost:4000";
  let socket;

  useEffect(() => {
    socket = io(URL, {
      withCredentials: true,
    });
  }, []);
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setProgress(0); // Reset progress before each request
    setError(null); // Clear any previous errors

    try {
      const response = await axios.get("http://localhost:4000/api/data");
      console.log("resssp: ", response.data);
      setData(response.data);
    } catch (error) {
      console.error(error);
      setError(error.message || "An error occurred"); // Handle potential error messages
    } finally {
      setIsLoading(false);
    }
  };

  const source = axios.CancelToken.source(); // Create cancellation token source

  useEffect(() => {
    const fetchDataWithProgress = async () => {
      const config = {
        onDownloadProgress: (event) => {
          const percentCompleted = Math.round(
            (event.loaded * 100) / event.total
          );
          setProgress(percentCompleted);
        },
        cancelToken: source.token,
      };

      try {
        const response = await axios.get("/api/data", config);
        setData(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled");
        } else {
          console.error(error);
          setError(error.message || "An error occurred"); // Handle potential error messages
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataWithProgress();

    return () => source.cancel("Request canceled (cleanup)"); // Cleanup function for cancellation
  }, []); // Run effect only once on component mount

  const handleCancel = () => {
    source.cancel("Request canceled by user"); // Cancel the request
  };

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
      <button onClick={handleCancel} disabled={!isLoading}>
        Cancel
      </button>
    </div>
  );
}

export default App;
