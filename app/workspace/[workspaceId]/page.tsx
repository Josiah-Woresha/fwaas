"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { FaTrash, FaArrowLeft, FaCopy } from "react-icons/fa"; // Added FaCopy

// Define types
interface Workspace {
  id: string;
  name: string;
  password: string;
}

interface Feedback {
  id: string;
  feedback: string;
  status: string;
  created_at: string;
  website_id: string;
}

export default function WorkspacePage() {
  const params = useParams();
  console.log("Params object:", params);

  const workspaceId = params?.workspaceId || params?.id; // Ensure correct key
  console.log("Extracted workspaceId:", workspaceId);

  const [workspace, setWorkspace] = useState<Workspace | null>(null); // Updated type
  const [feedback, setFeedback] = useState<Feedback[]>([]); // Updated type
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false); // State for copied status
  const router = useRouter();

  useEffect(() => {
    if (!workspaceId) {
      setError("Invalid workspace ID.");
      setLoading(false);
      return;
    }

    const fetchWorkspaceAndFeedback = async () => {
      console.log("Fetching workspace and feedback from Supabase...");

      // Fetch workspace details
      const { data: workspaceData, error: workspaceError } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", workspaceId)
        .single();

      if (workspaceError) {
        console.error("Error fetching workspace:", workspaceError);
        setError(workspaceError.message || "Workspace not found.");
        setLoading(false);
        return;
      }

      setWorkspace(workspaceData);

      // Fetch feedback linked to the workspace
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select("*")
        .eq("website_id", workspaceId);

      if (feedbackError) {
        console.error("Error fetching feedback:", feedbackError);
        setError(feedbackError.message || "Failed to fetch feedback.");
      } else {
        setFeedback(feedbackData || []);
      }

      setLoading(false);
    };

    fetchWorkspaceAndFeedback();
  }, [workspaceId]);

  // Function to copy workspace ID to clipboard
  const copyWorkspaceId = async () => {
    if (!workspace) return;

    try {
      await navigator.clipboard.writeText(workspace.id);
      setIsCopied(true); // Set copied status to true
      setTimeout(() => setIsCopied(false), 2000); // Reset copied status after 2 seconds
    } catch (err) {
      console.error("Failed to copy workspace ID:", err);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspace) return;
    if (!confirm(`Are you sure you want to delete "${workspace.name}"? This action cannot be undone.`)) return;

    const { error } = await supabase.from("workspaces").delete().eq("id", workspace.id);
    
    if (error) {
      alert("Error deleting workspace. Please try again.");
    } else {
      router.push("/auth/loggedin");
    }
  };

  // Function to update feedback status
  const updateFeedbackStatus = async (feedbackIds: string[], status: string) => {
    const { error } = await supabase
      .from("feedback")
      .update({ status })
      .in("id", feedbackIds);

    if (error) {
      console.error("Error updating feedback status:", error);
      alert("Failed to update feedback status. Please try again.");
    } else {
      // Update the local state
      setFeedback((prevFeedback) =>
        prevFeedback.map((item) =>
          feedbackIds.includes(item.id) ? { ...item, status } : item
        )
      );
      alert("Feedback status updated successfully!");
      setSelectedFeedback([]); // Clear selected feedback after updating status
    }
  };

  // Function to delete feedback
  const deleteFeedback = async (feedbackIds: string[]) => {
    if (!confirm("Are you sure you want to delete the selected feedback? This action cannot be undone.")) return;

    const { error } = await supabase
      .from("feedback")
      .delete()
      .in("id", feedbackIds);

    if (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete feedback. Please try again.");
    } else {
      // Remove the deleted feedback from the state
      setFeedback((prevFeedback) => prevFeedback.filter((item) => !feedbackIds.includes(item.id)));
      setSelectedFeedback([]); // Clear selection
      alert("Feedback deleted successfully!");
    }
  };

  // Function to handle actions from the dropdown menu
  const handleAction = (action: string) => {
    if (selectedFeedback.length === 0) return;

    switch (action) {
      case "seen":
        updateFeedbackStatus(selectedFeedback, "seen");
        break;
      case "in-progress":
        updateFeedbackStatus(selectedFeedback, "in-progress");
        break;
      case "fixed":
        updateFeedbackStatus(selectedFeedback, "fixed");
        break;
      case "not-relevant":
        updateFeedbackStatus(selectedFeedback, "not-relevant");
        break;
      case "ignore":
        updateFeedbackStatus(selectedFeedback, "ignore");
        break;
      case "delete":
        deleteFeedback(selectedFeedback);
        break;
      default:
        break;
    }
  };

  // Function to check if feedback is new (added in the last 24 hours)
  const isNewFeedback = (createdAt: string) => {
    const feedbackDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - feedbackDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!workspace) return <div className="p-8 text-red-500">Workspace not found.</div>;

  return (
    <div className={`p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
      {/* Top Bar with Back Arrow and Delete Workspace Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/auth/loggedin")}
          className="text-gray-600 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-300"
          title="Back to Dashboard"
        >
          <FaArrowLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleDeleteWorkspace}
          className="bg-red-500 text-white p-2 rounded flex items-center"
        >
          <FaTrash className="w-4 h-4 mr-2" />
          Delete Workspace
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Workspace Details</h1>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <p><strong>Name:</strong> {workspace.name}</p>
        <p className="flex items-center">
          <strong>ID:</strong> {workspace.id}
          <button
            onClick={copyWorkspaceId}
            className="ml-2 text-gray-600 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-300"
            title="Copy Workspace ID"
          >
            <FaCopy className="w-4 h-4" />
          </button>
          {isCopied && <span className="ml-2 text-green-600">Copied!</span>}
        </p>
        <p><strong>Password:</strong> {workspace.password}</p>
      </div>

      {/* Feedback Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Feedback</h2>

        {/* Dropdown Menu for Actions */}
        <div className="mb-4 flex items-center space-x-4">
          <select
            onChange={(e) => handleAction(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select Action</option>
            <option value="seen">Mark as Seen</option>
            <option value="in-progress">Mark as In Progress</option>
            <option value="fixed">Mark as Fixed</option>
            <option value="not-relevant">Mark as Not Relevant</option>
            <option value="ignore">Mark as Ignored</option>
            <option value="delete">Delete Selected</option>
          </select>
          <span className="text-gray-600 dark:text-gray-400">
            {selectedFeedback.length} feedback selected
          </span>
        </div>

        {feedback.length === 0 ? (
          <p>No feedback yet.</p>
        ) : (
          <ul className="space-y-2">
            {feedback.map((item) => (
              <li
                key={item.id}
                className="bg-white dark:bg-gray-800 p-3 rounded shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {/* Checkbox for Bulk Selection */}
                    <input
                      type="checkbox"
                      checked={selectedFeedback.includes(item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFeedback([...selectedFeedback, item.id]);
                        } else {
                          setSelectedFeedback(selectedFeedback.filter((id) => id !== item.id));
                        }
                      }}
                      className="mr-2"
                    />
                    <div className="flex-1">
                      {/* Feedback Text */}
                      <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                        {item.feedback}
                      </p>
                      {/* New and Status Badges */}
                      <div className="flex items-center space-x-2 mt-1">
                        {isNewFeedback(item.created_at) && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Status: <span className="font-semibold">{item.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Delete Feedback Button */}
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
                        deleteFeedback([item.id]);
                      }
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Feedback"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}