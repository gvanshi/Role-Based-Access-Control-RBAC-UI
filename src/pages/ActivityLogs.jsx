import React, { useEffect, useState } from 'react';
import './ActivityLogs.css'; // Ensure you have this file for styling

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]); // State to store activity logs
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Function to fetch activity logs
  const fetchLogs = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch('http://localhost:3001/activityLogs');
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }
      const data = await response.json();
      setLogs(data); // Update logs
    } catch (error) {
      setError(error.message); // Capture any error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchLogs(); // Fetch logs when the component mounts
  }, []);

  if (loading) {
    return <div className="logs-loading">Loading activity logs...</div>;
  }

  if (error) {
    return <div className="logs-error">Error: {error}</div>;
  }

  return (
    <div className="activity-logs-container">
      <h1>Activity Logs</h1>
      {logs.length === 0 ? (
        <p>No activities to display.</p>
      ) : (
        <table className="activity-logs-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActivityLogs;
