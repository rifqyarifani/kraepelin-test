"use client";

import { useEffect } from "react";
import { keepDatabaseAlive } from "@/app/actions/keep-alive";

/**
 * This component is designed to keep the database alive by making
 * periodic requests using server actions. It should be added
 * to the layout or a high-level component that is always rendered.
 */
export default function KeepAlive() {
  useEffect(() => {
    // Function to call the keep-alive server action
    const pingDatabase = async () => {
      try {
        const result = await keepDatabaseAlive();

        if (!result.success) {
          console.error("Failed to keep database alive:", result.error);
        }
      } catch (error) {
        console.error("Error keeping database alive:", error);
      }
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
