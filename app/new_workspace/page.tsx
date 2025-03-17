"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { FaArrowLeft } from "react-icons/fa"; // Import the back arrow icon

export default function NewWorkspace() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      setError("Workspace name is required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const userId = authData.user.id;
      const workspaceId = crypto.randomUUID();
      const workspacePassword = Math.random().toString(36).substring(2, 12);

      const { error } = await supabase
        .from("workspaces")
        .insert([{ id: workspaceId, name: workspaceName, password: workspacePassword, user_id: userId }]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push(`/workspace/${workspaceId}`);
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8`}>
      {/* Back Arrow (Fixed at Top-Left Corner) */}
      <button
        onClick={() => router.push("/auth/loggedin")}
        className="fixed top-4 left-4 text-gray-600 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
        title="Back to Dashboard"
      >
        <FaArrowLeft className="w-6 h-6" />
      </button>

      {/* Centered Form Container */}
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">Create New Workspace</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-100 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-100 px-4 py-3 rounded">
            Workspace created successfully! Redirecting...
          </div>
        )}

        {/* Workspace Creation Form */}
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="text"
              className="appearance-none w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Workspace Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Create Workspace Button */}
          <button
            onClick={handleCreateWorkspace}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              "Create Workspace"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
