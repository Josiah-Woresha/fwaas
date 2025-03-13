"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { FaTrash, FaArrowLeft, FaEdit, FaCheck, FaExclamationCircle, FaEye, FaSpinner, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";

export default function WorkspacePage() {
  const params = useParams();
  const workspaceId = params?.workspaceId || params?.id;
  const router = useRouter();

  const [workspace, setWorkspace] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!workspaceId) {
      setError("Invalid workspace ID.");
      setLoading(false);
      return;
    }

    const fetchWorkspaceAndFeedback = async () => {
      try {
        // Fetch workspace details
        const { data: workspaceData, error: workspaceError } = await supabase
          .from("workspaces")
          .select("*")
          .eq("id", workspaceId)
          .single();

        if (workspaceError) throw workspaceError;

        setWorkspace(workspaceData);
        setNewWorkspaceName(workspaceData.name);

        // Fetch feedback linked to the workspace
        const { data: feedbackData, error: feedbackError } = await supabase
          .from("feedback")
          .select("*")
          .eq("website_id", workspaceId)
          .order("created_at", { ascending: false });

        if (feedbackError) throw feedbackError;
        
        setFeedback(feedbackData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceAndFeedback();
  }, [workspaceId]);

  const handleDeleteWorkspace = async () => {
    try {
      const { error } = await supabase.from("workspaces").delete().eq("id", workspace.id);
      
      if (error) throw error;
      
      router.push("/auth/loggedin");
    } catch (err) {
      console.error("Error deleting workspace:", err);
      alert("Error deleting workspace. Please try again.");
    }
  };

  const handleUpdateWorkspaceName = async () => {
    if (!newWorkspaceName.trim()) return;
    
    try {
      const { error } = await supabase
        .from("workspaces")
        .update({ name: newWorkspaceName })
        .eq("id", workspace.id);
      
      if (error) throw error;
      
      setWorkspace({ ...workspace, name: newWorkspaceName });
      setIsEditingName(false);
    } catch (err) {
      console.error("Error updating workspace name:", err);
      alert("Failed to update workspace name. Please try again.");
    }
  };

  const updateFeedbackStatus = async (feedbackIds, status) => {
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ status })
        .in("id", feedbackIds);

      if (error) throw error;
      
      setFeedback((prevFeedback) =>
        prevFeedback.map((item) =>
          feedbackIds.includes(item.id) ? { ...item, status } : item
        )
      );
      
      // Clear selection after successful update
      setSelectedFeedback([]);
    } catch (err) {
      console.error("Error updating feedback status:", err);
      alert("Failed to update feedback status. Please try again.");
    }
  };

  const deleteFeedback = async (feedbackIds) => {
    try {
      const { error } = await supabase
        .from("feedback")
        .delete()
        .in("id", feedbackIds);

      if (error) throw error;
      
      setFeedback((prevFeedback) => 
        prevFeedback.filter((item) => !feedbackIds.includes(item.id))
      );
      setSelectedFeedback([]);
    } catch (err) {
      console.error("Error deleting feedback:", err);
      alert("Failed to delete feedback. Please try again.");
    }
  };

  const handleAction = (action) => {
    if (selectedFeedback.length === 0) {
      alert("Please select at least one feedback item.");
      return;
    }

    switch (action) {
      case "seen":
      case "in-progress":
      case "fixed":
      case "not-relevant":
      case "ignore":
        updateFeedbackStatus(selectedFeedback, action);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${selectedFeedback.length} feedback item(s)?`)) {
          deleteFeedback(selectedFeedback);
        }
        break;
      default:
        break;
    }
  };

  const selectAllFeedback = () => {
    if (selectedFeedback.length === filteredFeedback.length) {
      setSelectedFeedback([]);
    } else {
      setSelectedFeedback(filteredFeedback.map(item => item.id));
    }
  };

  const isNewFeedback = (createdAt) => {
    const feedbackDate = new Date(createdAt);
    const now = new Date();
    const diffInHours = (now.getTime() - feedbackDate.getTime()) / (1000 * 60 * 60);
    return diffInHours < 24;
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "seen": return "bg-purple-500";
      case "in-progress": return "bg-yellow-500";
      case "fixed": return "bg-green-500";
      case "not-relevant": return "bg-gray-500";
      case "ignore": return "bg-red-300";
      default: return "bg-blue-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new": return <FaExclamationCircle className="mr-1" />;
      case "seen": return <FaEye className="mr-1" />;
      case "in-progress": return <FaSpinner className="mr-1" />;
      case "fixed": return <FaCheck className="mr-1" />;
      case "not-relevant": return <FaFilter className="mr-1" />;
      case "ignore": return <FaTrash className="mr-1" />;
      default: return <FaExclamationCircle className="mr-1" />;
    }
  };

  // Filter feedback based on status and search query
  const filteredFeedback = feedback.filter(item => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch = item.feedback.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 mx-auto max-w-6xl">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => router.push("/auth/loggedin")}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 mx-auto max-w-6xl">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/auth/loggedin")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          title="Back to Dashboard"
        >
          <FaArrowLeft className="mr-2" />
          <span className="hidden md:block">Back to Dashboard</span>
        </button>

        {confirmDelete ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-red-600">Confirm deletion?</span>
            <button
              onClick={handleDeleteWorkspace}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors flex items-center"
          >
            <FaTrash className="mr-2" />
            Delete Workspace
          </button>
        )}
      </div>

      {/* Workspace Details Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4 flex items-center justify-between">
          {isEditingName ? (
            <div className="flex items-center w-full">
              <input
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="flex-grow border border-gray-300 rounded px-2 py-1"
                autoFocus
              />
              <button
                onClick={handleUpdateWorkspaceName}
                className="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setNewWorkspaceName(workspace.name);
                }}
                className="ml-2 bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <span>{workspace.name}</span>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-gray-600 hover:text-gray-900 ml-2"
                title="Edit Workspace Name"
              >
                <FaEdit className="w-4 h-4" />
              </button>
            </>
          )}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Workspace ID</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{workspace.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Password</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{workspace.password}</p>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          Feedback 
          <span className="ml-2 text-sm font-normal text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {feedback.length} total
          </span>
        </h2>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="seen">Seen</option>
              <option value="in-progress">In Progress</option>
              <option value="fixed">Fixed</option>
              <option value="not-relevant">Not Relevant</option>
              <option value="ignore">Ignored</option>
            </select>
            
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-gray-300 rounded flex-grow"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedFeedback.length} selected
            </span>
            
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAction(e.target.value);
                  e.target.value = ""; // Reset after action
                }
              }}
              className="p-2 border border-gray-300 rounded"
              disabled={selectedFeedback.length === 0}
            >
              <option value="">Bulk Actions</option>
              <option value="seen">Mark as Seen</option>
              <option value="in-progress">Mark as In Progress</option>
              <option value="fixed">Mark as Fixed</option>
              <option value="not-relevant">Mark as Not Relevant</option>
              <option value="ignore">Mark as Ignored</option>
              <option value="delete">Delete Selected</option>
            </select>
          </div>
        </div>

        {feedback.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback yet.</p>
            <p className="text-sm text-gray-400 mt-2">Feedback will appear here when users submit it.</p>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback matches your filters.</p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="