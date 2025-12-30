import React, { useEffect, useState } from "react";
import { getAllUsers } from "../utils/api";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Registered Users
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-700">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-5 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>

              <div className="mt-3">
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
                  Role: {user.role}
                </span>
              </div>

              <p className="text-gray-700 mt-3">
                <strong>Location:</strong> {user.location || "Not provided"}
              </p>

              <p className="text-gray-500 text-xs mt-2">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
