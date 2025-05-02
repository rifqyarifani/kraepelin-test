"use client";

import { useEffect } from "react";

/**
 * This component is designed to keep the database alive by making
 * periodic requests to the keep-alive endpoint. It should be added
 * to the layout or a high-level component that is always rendered.
 */
export default function KeepAlive() {
  useEffect(() => {
    // Function to call the keep-alive endpoint
    const pingDatabase = async () => {
      try {
        const response = await fetch("/api/keep-alive");
        const data = await response.json();

        if (data.success) {
        } else {
        }
      } catch (error) {}
    };

    // Call immediately on component mount
    pingDatabase();

    // Set up an interval to call every 10 minutes
    const intervalId = setInterval(pingDatabase, 10 * 60 * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // This component doesn't render anything
  return null;
}
