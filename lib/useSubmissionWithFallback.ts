import { useState, useCallback } from "react";

type SubmitPayload = {
  type: "recommend" | "note" | "notify" | "contact";
  [key: string]: any;
};

type SubmissionStatus = "idle" | "loading" | "success" | "error" | "offline";

interface FailedSubmission {
  timestamp: number;
  payload: SubmitPayload;
  attempts: number;
}

const STORAGE_KEY = "gir_failed_submissions";
const MAX_LOCAL_RETRIES = 5;

/** Retrieves failed submissions from localStorage */
function getFailedSubmissions(): FailedSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/** Saves failed submissions to localStorage */
function saveFailedSubmission(payload: SubmitPayload): void {
  if (typeof window === "undefined") return;
  try {
    const failed = getFailedSubmissions();
    failed.push({
      timestamp: Date.now(),
      payload,
      attempts: 0,
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(failed));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

/** Removes a successfully sent submission from localStorage */
function removeFailedSubmission(index: number): void {
  if (typeof window === "undefined") return;
  try {
    const failed = getFailedSubmissions();
    failed.splice(index, 1);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(failed));
  } catch {
    // Silently fail
  }
}

/** Retries all stored failed submissions */
async function retryFailedSubmissions(): Promise<number> {
  const failed = getFailedSubmissions();
  let retryCount = 0;

  for (let i = failed.length - 1; i >= 0; i--) {
    const submission = failed[i];

    if (submission.attempts >= MAX_LOCAL_RETRIES) {
      continue; // Skip if already retried too many times locally
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission.payload),
      });

      if (res.ok) {
        removeFailedSubmission(i);
        retryCount += 1;
      } else {
        submission.attempts += 1;
      }
    } catch {
      submission.attempts += 1;
    }
  }

  if (retryCount > 0) {
    // Save updated attempts
    const updated = getFailedSubmissions();
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }

  return retryCount;
}

/**
 * Hook for form submission with built-in redundancy.
 * Handles network failures gracefully with localStorage fallback.
 */
export function useSubmissionWithFallback() {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [pendingCount, setPendingCount] = useState(0);

  const updatePendingCount = useCallback(() => {
    if (typeof window !== "undefined") {
      const failed = getFailedSubmissions();
      setPendingCount(failed.length);
    }
  }, []);

  const submit = useCallback(
    async (payload: SubmitPayload): Promise<{ success: boolean }> => {
      setStatus("loading");

      // Check if online
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setStatus("offline");
        saveFailedSubmission(payload);
        updatePendingCount();
        return { success: false };
      }

      try {
        const res = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setStatus("success");
          updatePendingCount();
          return { success: true };
        }

        throw new Error("HTTP " + res.status);
      } catch (err) {
        console.error("Submission failed:", err);
        setStatus("error");
        saveFailedSubmission(payload);
        updatePendingCount();
        return { success: false };
      }
    },
    [updatePendingCount]
  );

  const retryPending = useCallback(async () => {
    setStatus("loading");
    try {
      const count = await retryFailedSubmissions();
      if (count > 0) {
        setStatus("success");
      } else {
        setStatus("idle");
      }
      updatePendingCount();
      return count;
    } catch (err) {
      console.error("Retry failed:", err);
      setStatus("error");
      return 0;
    }
  }, [updatePendingCount]);

  return {
    status,
    submit,
    retryPending,
    pendingCount,
    getFailedSubmissions,
  };
}
