"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ first_name: string; id: string } | null>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) {
        router.push("/auth/login");
        return;
      }

      const userId = authData.user.id;

      // Fetch user details
      const { data: userDetails } = await supabase
        .from("users")
        .select("first_name, id")
        .eq("id", userId)
        .single();

      if (userDetails) setUser(userDetails);

      // Fetch workspaces
      const { data: workspacesData, error: workspacesError } = await supabase
        .from("workspaces")
        .select("*")
        .eq("user_id", userId);

      if (workspacesError) {
        console.error("Error fetching workspaces:", workspacesError);
      }

      setWorkspaces(workspacesData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const handleNewWorkspace = () => {
    router.push("/new_workspace");
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

    const userId = user.id;

    // Delete all associated workspaces
    await supabase.from("workspaces").delete().eq("user_id", userId);

    // Delete user account
    const { error } = await supabase.from("users").delete().eq("id", userId);
    
    if (error) {
      alert("Error deleting account. Please try again.");
    } else {
      await supabase.auth.signOut();
      router.push("/auth/login");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          {user ? `${getGreeting()}, ${user.first_name}` : "Welcome"}
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-700 text-white p-2 rounded hover:bg-red-800 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Add Workspace Button */}
      <button
        onClick={handleNewWorkspace}
        className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors w-full sm:w-auto"
      >
        + Add Workspace
      </button>

      {/* Workspaces Section */}
      <div className="mt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Your Workspaces</h2>
        {workspaces.length === 0 ? (
          <p className="text-gray-600">No workspaces found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {workspaces.map((workspace, index) => (
              <div
                key={workspace.id}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => router.push(`/workspace/${workspace.id}`)}
              >
                <p className="text-gray-900 font-semibold text-lg">{workspace.name}</p>
                <p className="text-gray-600 text-sm mt-2">ID: {workspace.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}